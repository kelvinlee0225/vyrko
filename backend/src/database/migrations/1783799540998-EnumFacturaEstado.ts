import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnumFacturaEstado1783799540998 implements MigrationInterface {
  name = 'EnumFacturaEstado1783799540998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // The legacy varchar column already used these four values; normalize any stragglers.
    await queryRunner.query(`
      UPDATE "factura"
      SET "estado" = 'pendiente'
      WHERE "estado" NOT IN ('pendiente', 'pago_parcial', 'pagada', 'anulada')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."factura_estado_enum" AS ENUM(
        'pendiente', 'pago_parcial', 'pagada', 'anulada'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "factura"
        ALTER COLUMN "estado" DROP DEFAULT,
        ALTER COLUMN "estado" TYPE "public"."factura_estado_enum" USING "estado"::"public"."factura_estado_enum",
        ALTER COLUMN "estado" SET DEFAULT 'pendiente'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "factura"
        ALTER COLUMN "estado" DROP DEFAULT,
        ALTER COLUMN "estado" TYPE varchar USING "estado"::text,
        ALTER COLUMN "estado" SET DEFAULT 'pendiente'
    `);

    await queryRunner.query(`DROP TYPE "public"."factura_estado_enum"`);
  }
}
