# XML & Digital Signing — Study Guide

A learning path through everything `EcfXmlBuilderService`, `RfceXmlBuilderService`, and `EcfSignerService` actually do under the hood. Read top to bottom — each section builds on the last. Concepts are explained from first principles, then tied back to the specific code/files in this repo.

---

## 1. XML fundamentals (just enough to be dangerous)

XML represents data as nested **elements** (`<Tag>...</Tag>`), which can carry **attributes** (`<Tag attr="value">`) and text content. Two documents are "the same" in a meaningful sense if they have the same elements, attributes, and content — even if the *bytes* differ (whitespace, attribute order, formatting). That distinction — same meaning, different bytes — is the root of almost everything interesting in this guide (see §3, Canonicalization).

Two levels of correctness:
- **Well-formed**: valid XML syntax (tags close, nesting is correct) — a baseline any XML parser enforces.
- **Valid against a schema**: matches a specific contract for what elements/attributes/order are allowed — this is what XSD (§2) checks, and it's a stricter, document-specific requirement on top of well-formedness.

---

## 2. XSD — XML Schema Definition

An XSD file is a formal contract describing exactly what a valid document of some type looks like: which elements are allowed, in what order, how many times, with what data types, and what value constraints.

Key building blocks you'll see throughout `e-cf/xsd/*.xsd`:

- **`xs:element`** — declares a tag, e.g. `<xs:element name="RNCEmisor" type="RNCValidationType"/>`.
- **`xs:sequence`** — the children of an element must appear **in this exact order**. This is the single most important thing to internalize: DGII validates *positionally*. If `MontoGravadoI1` appears before `MontoGravadoTotal` in your XML, even though both are present and correctly formatted, DGII's validator can reject the document — order isn't cosmetic here. (We hit this for real — see `~/.claude/plans/.../check-grpahify-nodes-everything-snoopy-quasar.md`, Phase 2 notes: `MontoGravadoTotal` was emitted after `MontoGravadoI1` and we only caught it by validating against the real schema.)
- **`minOccurs` / `maxOccurs`** — cardinality. `minOccurs="0"` = optional; `minOccurs="1"` (or omitted, since 1 is XSD's default) = required; `maxOccurs="7"` = up to 7 repetitions.
- **`xs:simpleType` + `xs:restriction`** — defines a constrained value type: a `base` type (e.g. `xs:string`, `xs:integer`) plus **facets** narrowing it:
  - `xs:pattern` — a regex the value must match (e.g. `RNCValidationType`'s `[0-9]{11}|[0-9]{9}`).
  - `xs:enumeration` — a fixed list of allowed values (e.g. `TipoeCFType`'s `31`/`32`/.../`47`, or the 582-entry `ProvinciaMunicipioType` catalog we extracted into `backend/src/common/catalogos/`).
  - `xs:maxLength` / `xs:totalDigits` / `xs:fractionDigits` — length and numeric precision limits.
- **`xs:complexType`** — an element that contains other elements/attributes rather than just text.

**Why this matters practically:** an XSD is mechanically checkable. You don't have to trust that your code is right — you can *prove* it, by running the actual generated XML through a real XSD validator. That's exactly what we did (Python's `lxml`/`xmlschema`) every time a builder changed, rather than just reading the TypeScript and assuming it matched the spec. Treat the XSD as ground truth, not the paraphrased field tables in the PDFs — the PDFs occasionally disagree with or under-specify what the XSD enforces.

**A wrinkle you'll see in this repo:** DGII's own XSD files have real authoring defects — a broken forward type reference in `e-CF 31/32 v.1.0.xsd`, and non-standard `(?:...)` regex syntax in `RFCE 32 v.1.0.xsd` (XSD's regex dialect doesn't support non-capturing groups at all — it's a restricted Perl-like subset). These break some validators outright. We work around them in scratch copies purely for our own validation runs; DGII's actual reference files are never modified.

---

## 3. Canonicalization (C14N)

**The problem:** many different byte sequences represent the exact same logical XML document — different attribute order, different whitespace, `<a/>` vs `<a></a>`, different line endings. If you hash the raw bytes of a document, then someone's XML library re-serializes it slightly differently (which happens constantly, incidentally, not maliciously), the hash changes even though nothing meaningful did. For a digital signature — which is fundamentally "a hash of the content, encrypted" — that's fatal: a legitimate, untampered document could appear to have an "invalid" signature just because of formatting drift.

**The solution:** canonicalization is a deterministic algorithm that transforms *any* XML document into one single, agreed-upon byte representation. Two semantically-identical documents always canonicalize to identical bytes, no matter how differently they were originally formatted. Both signer and verifier canonicalize before hashing, so formatting differences become invisible to the comparison.

DGII specifies **Canonical XML 1.0** (`http://www.w3.org/TR/2001/REC-xml-c14n-20010315`) — the *plain*, non-"Exclusive" variant. The distinction matters here specifically because our signature is **enveloped** (embedded inside the document it signs, as its last child — see §7). Non-exclusive C14N accounts for the full ancestor namespace context of the whole document tree when normalizing; "Exclusive" C14N deliberately drops that inherited context, which is meant for a different scenario (XML fragments moved independently between documents, e.g. SOAP). Using the wrong one produces byte-different canonical output → different hash → verification failure, even with otherwise-correct code.

**Where it happens in our code:** `EcfSignerService` configures `canonicalizationAlgorithm: CANONICALIZATION_ALGORITHM` on the `SignedXml` instance from `xml-crypto`, pointing at exactly this URL.

---

## 4. Cryptographic hashing (digests)

A hash function takes arbitrary-length input and produces a fixed-size "fingerprint" with three properties that matter here:
1. **Deterministic** — same input always produces the same output.
2. **One-way** — you can't reverse a hash back into the original input.
3. **Avalanche effect** — changing even one bit of input produces a completely different, unpredictable output.

DGII mandates **SHA-256** everywhere in the e-CF ecosystem — no exceptions found anywhere across all 18 documents in `e-cf/`. SHA-256 produces a 256-bit (32-byte) digest, usually represented as 64 hex characters.

Two distinct places we use it:
- **Digesting the signed content** — part of the XML-DSig process (§7): the canonicalized document gets SHA-256 hashed, and that digest is what actually gets signed.
- **`CodigoSeguridadeCF`** — the RFCE security code is literally defined by DGII as "the first six characters of the hash generated from the `SignatureValue`" — i.e., take the already-computed signature value, SHA-256 it again, hex-encode, take the first 6 characters. See `EcfSignerService.computeCodigoSeguridad()`.

---

## 5. Public-key (asymmetric) cryptography

Unlike a password (one secret, checked by comparison), asymmetric cryptography uses a **pair** of mathematically related keys:
- A **private key** — kept secret, never shared.
- A **public key** — can be shared with anyone.

The core property that makes signing possible: something signed with the private key can be verified by anyone holding the corresponding public key, but *cannot be forged* by anyone who only has the public key. Knowing the public key doesn't let you derive the private key (that's the whole point — it'd be useless otherwise).

We use **RSA**, specifically `RSA-SHA256` (`http://www.w3.org/2001/04/xmldsig-more#rsa-sha256`) — meaning: take the SHA-256 digest of the content (§4), then apply RSA's signing operation using the private key. Verification reverses this using the public key.

**Why this proves both authenticity and integrity:**
- *Authenticity* — only the holder of the private key could have produced a signature that verifies against the matching public key.
- *Integrity* — the signature covers a specific digest; if the content changes even slightly, the digest changes (§4's avalanche effect), so the old signature no longer matches the new content.

---

## 6. Digital certificates & X.509

A raw public key by itself doesn't tell you *whose* key it is. A **digital certificate** solves that: it bundles a public key together with identity information (who it belongs to — the business's RNC, in our case), and the whole bundle is itself signed by a **Certificate Authority (CA)** — a trusted third party vouching "yes, this public key really does belong to this identity."

**X.509** is the standard format for certificates — this is what `forge.pki.certificateToPem()` produces in our code.

For DGII, the accredited CAs are specific named providers: Viafirma, Digifirma, Novofirma (per `e-cf/Instructivo_20App_20Firma_20Digital.pdf`). A certificate from one of these is what will eventually go into `DGII_CERT_PATH`.

**Why we embed the certificate in the signed document:** so anyone verifying the signature (DGII, or later, anyone checking a receipt) doesn't need to separately look up "whose key is this" — the certificate travels with the signature, in `KeyInfo/X509Data/X509Certificate`. That's what `getKeyInfoContent` controls in `EcfSignerService`.

---

## 7. PKCS#12 (`.p12`/`.pfx`) and PEM

**PKCS#12** is a standard binary container format for bundling a private key and its certificate (and chain) together into one password-encrypted file — the `.p12` DGII certificates come as. It exists because distributing "your key and cert as one protected file" is more convenient and less error-prone than shipping them separately.

**PEM** is a different thing: a text-based (base64, wrapped with `-----BEGIN ... -----`/`-----END ... -----` headers) representation of a single key or certificate. Most crypto libraries — including `xml-crypto` — expect PEM strings, not PKCS#12 containers.

**Why `node-forge` exists in this codebase:** its one job is bridging these two formats — `EcfSignerService.loadCertificate()` reads the `.p12` file, parses its ASN.1 structure (`forge.asn1.fromDer`), unpacks it with the password (`forge.pkcs12.pkcs12FromAsn1`), pulls out the certificate and private key "bags," and converts each to PEM (`forge.pki.certificateToPem` / `forge.pki.privateKeyToPem`) for `xml-crypto` to consume.

---

## 8. XML-DSig — the standard that ties it all together

**XML-DSig** (XML Digital Signature, a W3C standard — DGII cites `https://www.w3.org/TR/xmldsig-core2/` directly in `e-cf/Firmado de e-CF.pdf`) defines how to embed a digital signature *inside* an XML document. It's the umbrella spec that everything above (§3–§7) serves.

The `<Signature>` block has this shape:

```xml
<Signature>
  <SignedInfo>
    <CanonicalizationMethod Algorithm="...C14N URL..."/>
    <SignatureMethod Algorithm="...RSA-SHA256 URL..."/>
    <Reference URI="">
      <Transforms>
        <Transform Algorithm="...enveloped-signature URL..."/>
      </Transforms>
      <DigestMethod Algorithm="...SHA-256 URL..."/>
      <DigestValue>[base64 hash of the referenced content]</DigestValue>
    </Reference>
  </SignedInfo>
  <SignatureValue>[base64 RSA signature of the canonicalized SignedInfo]</SignatureValue>
  <KeyInfo>
    <X509Data><X509Certificate>[base64 cert]</X509Certificate></X509Data>
  </KeyInfo>
</Signature>
```

Piece by piece:
- **`Reference`** — describes *what* is being signed. `URI=""` means "the whole document" (as opposed to `URI="#someId"`, which would sign just one element by ID).
- **`Transforms`** — processing steps applied to the referenced content *before* it's hashed. We use exactly one: the **enveloped-signature transform**. This solves a chicken-and-egg problem: the signature is going to be embedded *inside* the very document it signs, but the signature obviously can't include itself in what it signs (that would be circular — the digest would change the instant you added the SignatureValue, invalidating itself). The enveloped-signature transform's job is simply "strip out the `<Signature>` element itself before computing the digest of everything else."
- **`DigestValue`** — the SHA-256 hash (§4) of the referenced content, after transforms and canonicalization (§3).
- **`SignedInfo`** — the block listing all of the above. This whole block gets canonicalized (per its own `CanonicalizationMethod`) and *that* canonicalized form is what actually gets RSA-signed — not the document content directly. This indirection is what lets the digest and the signature algorithm be checked independently.
- **`SignatureValue`** — the actual RSA signature (§5) of the canonicalized `SignedInfo`.
- **`KeyInfo`** — the embedded certificate (§6), so the verifier has the public key without needing it supplied separately.

**Enveloped vs. enveloping vs. detached** (terminology you'll see in XML-DSig docs generally, not just DGII's): *enveloped* = signature lives inside the signed document (our case — `<Signature>` is the last child of `<ECF>`/`<RFCE>`). *Enveloping* = the reverse, the signed data lives inside the `<Signature>` element. *Detached* = signature and signed content are in entirely separate files/locations. DGII requires enveloped, always.

---

## 9. The full flow, concept by concept

Putting §1–§8 in the order our code actually executes them (`EcfSignerService.sign()`):

1. **Build** the unsigned XML (`xmlbuilder2`, in `EcfXmlBuilderService`/`RfceXmlBuilderService`) — pure structure, no crypto yet.
2. **Load** the certificate: read the `.p12` (§7), decrypt with the password, extract private key + cert as PEM.
3. **Configure** `xml-crypto`'s `SignedXml` with: the private key, the cert (for embedding), `RSA-SHA256` as the signature algorithm (§5), plain C14N as the canonicalization algorithm (§3).
4. **Add a reference**: `URI=""` (whole document), enveloped-signature transform (§8), SHA-256 digest (§4).
5. **Compute the signature**: `xml-crypto` canonicalizes the referenced content (minus the not-yet-added `<Signature>`), hashes it (`DigestValue`), builds `SignedInfo`, canonicalizes *that*, signs it with the private key (`SignatureValue`), and assembles the full `<Signature>` block with the embedded certificate.
6. **Append** the `<Signature>` as the last child of the root element — the result is what gets submitted to DGII (or, for RFCE, hashed again for `CodigoSeguridadeCF` first — §4).

**Verification** (what DGII does on their end, and what we did ourselves in testing via `checkSignature()`) runs this in reverse: extract the `<Signature>`, recompute the canonicalization + digest of the referenced content, recompute the canonicalization of `SignedInfo`, use the *public* key from the embedded certificate to check that `SignatureValue` really is a valid RSA signature of that canonicalized `SignedInfo` — mathematically, not by comparison to a stored copy.

---

## 10. Quick reference — exactly what DGII mandates

| Concept | DGII's choice | Where specified |
|---|---|---|
| Canonicalization | Canonical XML 1.0 (non-exclusive) | `e-cf/Firmado de e-CF.pdf` |
| Digest algorithm | SHA-256 | same, + every XSD's `DigestMethod` |
| Signature algorithm | RSA-SHA256 | same |
| Reference scope | Whole document (`URI=""`) | same |
| Transform | Enveloped-signature | same |
| Signature placement | Last child of root element | XSD's `<xs:any processContents="skip"/>` slot after the last real field |
| Certificate source | Viafirma / Digifirma / Novofirma (accredited CAs) | `e-cf/Instructivo_20App_20Firma_20Digital.pdf` |
