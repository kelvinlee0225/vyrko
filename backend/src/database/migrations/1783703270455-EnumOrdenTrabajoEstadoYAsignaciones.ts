import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnumOrdenTrabajoEstadoYAsignaciones1783703270455 implements MigrationInterface {
  name = 'EnumOrdenTrabajoEstadoYAsignaciones1783703270455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Map legacy free-text estados onto the new set before converting the column.
    await queryRunner.query(`
      UPDATE "orden_trabajo"
      SET "estado" = CASE "estado"
        WHEN 'recibido' THEN 'recibida'
        WHEN 'esperando_piezas' THEN 'recibida'
        WHEN 'en_progreso' THEN 'en_progreso'
        WHEN 'completado' THEN 'entregada'
        WHEN 'entregado' THEN 'entregada'
        WHEN 'cancelado' THEN 'cancelada'
        ELSE 'pendiente'
      END
      WHERE "estado" NOT IN (
        'pendiente', 'recibida', 'en_progreso',
        'entregada_temporalmente', 'entregada', 'cancelada'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."orden_trabajo_estado_enum" AS ENUM(
        'pendiente', 'recibida', 'en_progreso',
        'entregada_temporalmente', 'entregada', 'cancelada'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "orden_trabajo"
        ALTER COLUMN "estado" DROP DEFAULT,
        ALTER COLUMN "estado" TYPE "public"."orden_trabajo_estado_enum" USING "estado"::"public"."orden_trabajo_estado_enum",
        ALTER COLUMN "estado" SET DEFAULT 'pendiente'
    `);

    await queryRunner.query(`
      CREATE TABLE "orden_trabajo_asignacion" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "orden_trabajo_id" uuid NOT NULL,
        "tecnico_id" uuid NOT NULL,
        "asignado_en" timestamp NOT NULL DEFAULT now(),
        "notas" varchar,
        CONSTRAINT "PK_orden_trabajo_asignacion" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orden_trabajo_asignacion_orden" FOREIGN KEY ("orden_trabajo_id") REFERENCES "orden_trabajo" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_orden_trabajo_asignacion_tecnico" FOREIGN KEY ("tecnico_id") REFERENCES "tecnico" ("id")
      )
    `);

    // Backfill: every existing orden gets its current técnico as the initial assignment.
    await queryRunner.query(`
      INSERT INTO "orden_trabajo_asignacion" ("orden_trabajo_id", "tecnico_id", "asignado_en", "notas")
      SELECT "id", "tecnico_id", "created_at", 'Asignación inicial'
      FROM "orden_trabajo"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orden_trabajo_asignacion"`);

    await queryRunner.query(`
      ALTER TABLE "orden_trabajo"
        ALTER COLUMN "estado" DROP DEFAULT,
        ALTER COLUMN "estado" TYPE varchar USING "estado"::text,
        ALTER COLUMN "estado" SET DEFAULT 'recibido'
    `);

    await queryRunner.query(`DROP TYPE "public"."orden_trabajo_estado_enum"`);
  }
}
