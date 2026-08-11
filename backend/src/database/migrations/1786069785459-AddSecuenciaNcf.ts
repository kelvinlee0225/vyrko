import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSecuenciaNcf1786069785459 implements MigrationInterface {
  name = 'AddSecuenciaNcf1786069785459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "secuencia_ncf" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "tipo_ecf" int NOT NULL,
        "desde" int NOT NULL,
        "hasta" int NOT NULL,
        "actual" int NOT NULL,
        "fecha_vencimiento" date,
        "activa" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_secuencia_ncf" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "secuencia_ncf"`);
  }
}
