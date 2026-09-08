import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAseguradora1783025395234 implements MigrationInterface {
  name = 'AddAseguradora1783025395234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "aseguradora" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "nombre" varchar NOT NULL,
        "rnc_cedula" varchar,
        "telefono" varchar,
        "correo" varchar,
        "direccion" varchar,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_aseguradora" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "vehiculo"
      ADD COLUMN "aseguradora_id" uuid,
      ADD CONSTRAINT "FK_vehiculo_aseguradora" FOREIGN KEY ("aseguradora_id") REFERENCES "aseguradora" ("id")
    `);
    await queryRunner.query(`
      ALTER TABLE "vehiculo" ALTER COLUMN "aseguradora_id" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "vehiculo" DROP CONSTRAINT "FK_vehiculo_aseguradora"
    `);
    await queryRunner.query(`
      ALTER TABLE "vehiculo" DROP COLUMN "aseguradora_id"
    `);
    await queryRunner.query(`DROP TABLE "aseguradora"`);
  }
}
