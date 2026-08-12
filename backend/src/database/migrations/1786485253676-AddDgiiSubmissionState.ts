import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDgiiSubmissionState1786485253676 implements MigrationInterface {
  name = 'AddDgiiSubmissionState1786485253676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ambiente_dgii moves to the DGII_AMBIENTE env var (deployment concern,
    // same reasoning as DGII_CERT_PATH/DGII_CERT_PASSWORD) rather than a
    // per-row DB setting.
    await queryRunner.query(`
      ALTER TABLE "empresa"
        DROP COLUMN "ambiente_dgii"
    `);
    await queryRunner.query(`DROP TYPE "public"."empresa_ambiente_dgii_enum"`);

    await queryRunner.query(`
      ALTER TABLE "empresa"
        ADD COLUMN "dgii_token" text,
        ADD COLUMN "dgii_token_expira" timestamptz
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."factura_estado_dgii_enum" AS ENUM(
        'enviado', 'en_proceso', 'aceptado', 'aceptado_condicional', 'rechazado'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "factura"
        ADD COLUMN "e_ncf" varchar(13) UNIQUE,
        ADD COLUMN "codigo_seguridad" varchar(6),
        ADD COLUMN "fecha_firma" timestamptz,
        ADD COLUMN "xml_generado" text,
        ADD COLUMN "estado_dgii" "public"."factura_estado_dgii_enum",
        ADD COLUMN "track_id" varchar,
        ADD COLUMN "mensajes_dgii" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "factura"
        DROP COLUMN "e_ncf",
        DROP COLUMN "codigo_seguridad",
        DROP COLUMN "fecha_firma",
        DROP COLUMN "xml_generado",
        DROP COLUMN "estado_dgii",
        DROP COLUMN "track_id",
        DROP COLUMN "mensajes_dgii"
    `);
    await queryRunner.query(`DROP TYPE "public"."factura_estado_dgii_enum"`);

    await queryRunner.query(`
      ALTER TABLE "empresa"
        DROP COLUMN "dgii_token",
        DROP COLUMN "dgii_token_expira"
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."empresa_ambiente_dgii_enum" AS ENUM(
        'precertificacion', 'certificacion', 'produccion'
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "empresa"
        ADD COLUMN "ambiente_dgii" "public"."empresa_ambiente_dgii_enum" NOT NULL DEFAULT 'precertificacion'
    `);
  }
}
