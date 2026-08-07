# AWS Deployment Notes — Vyrko

Living document. This is not a deployment already in place — it's a running set of recommendations for *when* vyrko moves to AWS, updated as we build out each part of the app (especially the DGII facturación electrónica work). Written for a first-time AWS user, so each recommendation includes *why*, not just *what*.

Context this is calibrated against: a single-shop car repair management app — NestJS backend, React/Vite frontend, Postgres, low traffic, one company (not multi-tenant). Every recommendation below optimizes for **lowest operational complexity that's still correct**, not for scale we don't need. Where a "proper" enterprise pattern exists but is overkill here, it's noted as a later upgrade path rather than a starting point — same reasoning we used for Secrets Manager vs. a file on disk.

Status legend: ✅ decided · 🤔 open question · ⏳ revisit later (not needed yet)

---

## 1. Compute — where the NestJS backend runs

**✅ Recommendation: a single EC2 instance** (t4g.small or t3.small — ARM Graviton `t4g` is ~20% cheaper than `t3` for the same spec and vyrko's Node/Postgres stack runs fine on ARM).

**Why over the alternatives:**
- *ECS Fargate / App Runner* (containerized, no server to manage) is the more "correct" 2026 default for production services, but it front-loads Docker, task definitions, and networking concepts before you've learned plain EC2. Since you explicitly want this as a first real AWS project, EC2 teaches the fundamentals (SSH, systemd, security groups, a reverse proxy) that transfer to everything else in AWS — Fargate's abstractions are easier to understand *after* you've felt what they're hiding.
- *Elastic Beanstalk* hides even more (it wraps EC2+ALB+ASG for you) — good for shipping fast, bad for learning, and harder to debug when something goes wrong because you didn't build the pieces yourself.
- A single small instance is enough for one shop's traffic. No auto-scaling group needed at this stage.

**How it fits the app:** run the NestJS backend under `systemd` (or `pm2`) behind `nginx` on the instance, which also terminates TLS (see §4) and can proxy the DGII-facing endpoints (§5).

**⏳ Revisit when:** you have real uptime requirements (a second shop, real customers depending on it during business hours) or need zero-downtime deploys — that's the trigger to move to an Application Load Balancer + Auto Scaling Group, or containerize onto Fargate.

---

## 2. Database — Postgres

**✅ Recommendation: RDS for PostgreSQL** (`db.t4g.micro`), not self-hosting Postgres on the same EC2 box.

**Why:** RDS gives you automated daily backups + point-in-time recovery, minor-version patching, and easy vertical resizing, for a small monthly premium over running Postgres yourself. For a car shop's system of record (invoices, fiscal e-CF data — data DGII will expect you to be able to produce on request), "we have automatic backups" shouldn't depend on you remembering to set up `pg_dump` cron jobs correctly. This is one of the few places where the managed service is worth it even at tiny scale — the failure mode of *not* having it (silent backup rot, a botched manual restore) is disproportionately bad.

**⏳ Revisit when:** never, really, at this scale — RDS scales down to genuinely cheap tiers and there's no strong reason to self-host Postgres for a system this size.

---

## 3. Secrets — the DGII digital certificate (`.p12`) and its password

**✅ Decided (app-level): file on disk**, not in Postgres — see prior discussion. The app reads a path from `DGII_CERT_PATH` / `DGII_CERT_PASSWORD` env vars, never stores the cert bytes in a DB column. This keeps the app cloud-agnostic — it doesn't need AWS SDK code to boot.

**🤔 Open question — how the file *gets onto* the EC2 instance and stays updated:**
- **Simplest**: `scp` it onto the instance once (`/etc/vyrko/secrets/empresa.p12`, `chmod 600`, owned by the app's service user), same as you'd do on any VPS. Works, but rotating the cert means SSH-ing in by hand.
- **Recommended once on AWS: SSM Parameter Store (SecureString)** — not Secrets Manager. Parameter Store's `SecureString` type gives you the same KMS-encrypted-at-rest secret storage, IAM-gated access, and no plaintext-in-git, but it's **free** (vs. Secrets Manager's $0.40/secret/month + API charges) and doesn't bring automatic-rotation machinery you don't need for a certificate that changes maybe once a year. A small boot script (or systemd `ExecStartPre`) pulls the cert + password from Parameter Store into the file path at deploy time, so the *app itself* still just reads a file — you get "pull from AWS" convenience without coupling the app code to AWS.
- Reconfirms the earlier answer: **Secrets Manager stays the wrong tier for this** even on AWS — no rotation automation needed, one secret, one consumer. Parameter Store SecureString is the AWS-native "right-sized" version of the same file-on-disk idea.

---

## 4. TLS / DNS — public HTTPS for the app and for DGII to call back into

The DGII "Receptor Electrónico" requirement (Phase 4 of the e-CF plan) means this backend needs a **stable, public HTTPS endpoint** DGII/counterparties can reach — this isn't optional once certified.

**✅ Recommendation:**
- **Route 53** for the domain's DNS (hosted zone, ~$0.50/mo) — only needed if the domain isn't already hosted elsewhere; if you already own a domain elsewhere, you can point its DNS at the EC2 instance without moving it to Route 53.
- **TLS via Certbot/Let's Encrypt on the instance** (through nginx), not an AWS Application Load Balancer + ACM, *at this stage*. An ALB has a fixed hourly cost (~$16+/mo minimum) whether or not it's doing anything useful for you yet — for a single instance, nginx+Certbot gets you the same TLS security for effectively free and is a genuinely useful thing to learn (cert renewal, nginx config) as a first-timer.

**⏳ Revisit when:** you add a second backend instance (then you need a load balancer to distribute traffic anyway, and ALB + ACM becomes the natural fit — ACM certs are free but only usable behind an ALB/CloudFront, which is why it's not worth adopting before you have one).

---

## 5. Frontend hosting (React/Vite SPA)

**✅ Recommendation: S3 (static bucket) + CloudFront (CDN, free tier covers this easily)**, entirely separate from the EC2 backend.

**Why:** the frontend is just static files after `vite build` — paying for a server to host static files is unnecessary, and S3+CloudFront is the standard, cheap, instructive pattern for this (you'll learn bucket policies, CloudFront distributions, and cache invalidation on deploy — all broadly transferable AWS skills). CloudFront also gives you free TLS via ACM (ACM certs *are* usable here, unlike the backend case above, because CloudFront is exactly the kind of AWS-managed edge service ACM integrates with).

This also decouples frontend deploys from backend deploys — pushing a UI change doesn't touch the EC2 instance at all.

---

## 6. File storage — retained e-CF/RFCE XML

DGII requires you to retain the signed e-CF XML locally even when only a summary (RFCE) was transmitted (Phase 2/3 of the e-CF plan). The current Phase 1 plan stores this as a `text` column (`factura.xml_generado`) directly in Postgres for simplicity while everything is local/pre-AWS.

**⏳ Revisit at AWS deploy time: move this to S3.** Reasoning: XML blobs are exactly what object storage is for — they're write-once, read-rarely, and grow unbounded with invoice volume, which is a bad shape for a relational DB's row storage and your RDS backup size/cost over time. On AWS, the plan should become: upload the signed XML to a private S3 bucket keyed by `RNC+eNCF.xml` (DGII's own filename standard — convenient, it's already the right S3 key), store just the S3 key in the `Factura` row, and set an S3 Lifecycle rule to transition old XML to Glacier after e.g. 1–2 years for cheap long-term retention (DGII/tax audit windows are multi-year). Not urgent to change before then — just flagging it now so the DB schema doesn't calcify around "XML lives in Postgres" as if that were the permanent design.

---

## 7. Background jobs (token refresh, TrackId polling, contingency resubmission)

**✅ Recommendation: keep these in-process** via `@nestjs/schedule` (already the plan for Phase 3/5) running as cron-like tasks inside the same NestJS process on the EC2 instance — do **not** reach for EventBridge Scheduler + Lambda for this.

**Why:** serverless cron is the right answer when jobs need to scale independently of your app or run across many instances without double-firing. At one EC2 instance, in-process scheduling is simpler (no separate deployable, no separate AWS IAM/DB access to wire up) and does the same job.

**⚠️ Gotcha to remember for later:** if you ever *do* scale to multiple backend instances (§1's "revisit when"), in-process `@nestjs/schedule` jobs will fire once **per instance**, which is wrong for things like DGII token refresh or TrackId polling (duplicate submissions, wasted API calls). That's the trigger to move scheduled jobs out to something singleton-safe — either EventBridge + Lambda, or a distributed lock around the in-process jobs. Not a concern at one instance.

---

## 8. Monitoring & logs

**✅ Recommendation: CloudWatch Logs** (ship nginx + Node app logs via the CloudWatch agent) **+ a couple of CloudWatch Alarms** (disk space on the EC2 root volume, and — specific to this app — a metric/alarm on repeated DGII submission failures, since a string of `rechazado` e-CF responses is a "call someone now" situation for a business that legally can't stop invoicing).

**Why this over alternatives:** CloudWatch is already "free" in the sense that you're paying for the EC2/RDS resources anyway and CloudWatch's basic tier is cheap; it's also the first observability tool worth learning on AWS since everything else (RDS, Lambda, ALB) reports into it too. Third-party tools (Datadog, Grafana Cloud) are more capable but are an unnecessary second subscription/second thing to learn for a system this size.

---

## 9. Rough cost shape (minimal recommended stack)

| Service | Est. monthly cost | Notes |
|---|---|---|
| EC2 t4g.small | ~$12 | on-demand; cheaper with a 1-yr Savings Plan once you know you'll keep it |
| RDS db.t4g.micro (Postgres) | ~$13 | single-AZ; Multi-AZ roughly doubles this — not needed yet |
| Route 53 hosted zone | ~$0.50 | only if migrating DNS to AWS |
| S3 + CloudFront (frontend + XML archive) | ~$1–3 | scales with traffic/storage, starts near-zero |
| SSM Parameter Store (SecureString) | $0 | free tier covers this use case entirely |
| CloudWatch (logs + alarms) | ~$1–3 | depends on log volume |
| **Total** | **~$28–32/mo** | before any domain registration cost |

Compare to the "proper enterprise" version of the same stack (ALB, Fargate, Secrets Manager, Multi-AZ RDS, WAF) which would run meaningfully higher (~$100+/mo) for reliability/scale headroom a one-shop system doesn't need yet.

---

## Open questions to resolve before actually deploying

1. Do you already own a domain, and is it already on Route 53 or elsewhere (Namecheap, GoDaddy, etc.)?
2. AWS region — pick one close to the Dominican Republic for latency to both your users and to DGII's own services; `us-east-1` (N. Virginia) is the common default and has the deepest service availability, worth defaulting to unless there's a reason not to.
3. Single AWS account is fine at this size — no need for AWS Organizations/multi-account setup yet.

---

*Last updated: alongside Phase 1 (data model & config foundation) of the DGII e-CF implementation plan (`~/.claude/plans/check-grpahify-nodes-everything-snoopy-quasar.md`). Update this file's relevant section whenever a later phase changes what needs deploying (e.g. Phase 4's inbound Receptor Electrónico endpoints, Phase 5's contingency queue).*
