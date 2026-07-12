import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnumCotizacionEstado1783658017852 implements MigrationInterface {
  name = 'EnumCotizacionEstado1783658017852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Legacy free-text values (pendiente, enviada, aprobada, rechazada, ...)
    // don't map to the new enum's states, so fold them into borrador first.
    await queryRunner.query(`
      UPDATE "cotizacion"
      SET "estado" = 'borrador'
      WHERE "estado" NOT IN ('borrador', 'entregada', 'vencida')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."cotizacion_estado_enum" AS ENUM('borrador', 'entregada', 'vencida')
    `);

    await queryRunner.query(`
      ALTER TABLE "cotizacion"
        ALTER COLUMN "estado" DROP DEFAULT,
        ALTER COLUMN "estado" TYPE "public"."cotizacion_estado_enum" USING "estado"::"public"."cotizacion_estado_enum",
        ALTER COLUMN "estado" SET DEFAULT 'borrador'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cotizacion"
        ALTER COLUMN "estado" DROP DEFAULT,
        ALTER COLUMN "estado" TYPE varchar USING "estado"::text,
        ALTER COLUMN "estado" SET DEFAULT 'pendiente'
    `);

    await queryRunner.query(`DROP TYPE "public"."cotizacion_estado_enum"`);
  }
}
