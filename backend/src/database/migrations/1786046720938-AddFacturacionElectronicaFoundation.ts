import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFacturacionElectronicaFoundation1786046720938
  implements MigrationInterface
{
  name = 'AddFacturacionElectronicaFoundation1786046720938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."empresa_ambiente_dgii_enum" AS ENUM(
        'precertificacion', 'certificacion', 'produccion'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "empresa"
        ADD COLUMN "nombre_comercial" varchar,
        ADD COLUMN "municipio" varchar,
        ADD COLUMN "provincia" varchar,
        ADD COLUMN "actividad_economica" varchar,
        ADD COLUMN "ambiente_dgii" "public"."empresa_ambiente_dgii_enum" NOT NULL DEFAULT 'precertificacion'
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."cliente_tipo_identificacion_enum" AS ENUM(
        'RNC', 'CEDULA', 'NINGUNA'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "cliente"
        ADD COLUMN "tipo_identificacion" "public"."cliente_tipo_identificacion_enum" NOT NULL DEFAULT 'NINGUNA'
    `);

    // "cedula_rnc" only ever held an RNC or a cédula; renamed now that
    // "tipo_identificacion" makes that distinction explicit.
    await queryRunner.query(`
      ALTER TABLE "cliente"
        RENAME COLUMN "cedula_rnc" TO "numero_identificacion"
    `);

    await queryRunner.query(`
      ALTER TABLE "factura"
        ADD COLUMN "tipo_ecf" int
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "factura"
        DROP COLUMN "tipo_ecf"
    `);

    await queryRunner.query(`
      ALTER TABLE "cliente"
        RENAME COLUMN "numero_identificacion" TO "cedula_rnc"
    `);

    await queryRunner.query(`
      ALTER TABLE "cliente"
        DROP COLUMN "tipo_identificacion"
    `);
    await queryRunner.query(`DROP TYPE "public"."cliente_tipo_identificacion_enum"`);

    await queryRunner.query(`
      ALTER TABLE "empresa"
        DROP COLUMN "nombre_comercial",
        DROP COLUMN "municipio",
        DROP COLUMN "provincia",
        DROP COLUMN "actividad_economica",
        DROP COLUMN "ambiente_dgii"
    `);
    await queryRunner.query(`DROP TYPE "public"."empresa_ambiente_dgii_enum"`);
  }
}
