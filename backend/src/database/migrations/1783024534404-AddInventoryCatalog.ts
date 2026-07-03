import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventoryCatalog1783024534404 implements MigrationInterface {
  name = 'AddInventoryCatalog1783024534404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "categoria_material" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "nombre" varchar NOT NULL,
        CONSTRAINT "PK_categoria_material" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "material" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "categoria_id" uuid NOT NULL,
        "codigo" varchar NOT NULL,
        "nombre" varchar NOT NULL,
        "precio_costo" decimal(12,2) NOT NULL,
        "stock_actual" decimal(10,2) NOT NULL DEFAULT 0,
        "stock_minimo" int NOT NULL DEFAULT 0,
        CONSTRAINT "PK_material" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_material_codigo" UNIQUE ("codigo"),
        CONSTRAINT "FK_material_categoria" FOREIGN KEY ("categoria_id") REFERENCES "categoria_material" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "proveedor" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "nombre" varchar NOT NULL,
        "rnc_cedula" varchar,
        "telefono" varchar,
        "correo" varchar,
        "direccion" varchar,
        "contacto" varchar,
        "emite_comprobante" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_proveedor" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "servicio" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "nombre" varchar NOT NULL,
        "tipo_trabajo" varchar NOT NULL,
        "precio_base" decimal(12,2) NOT NULL,
        "lleva_itbis" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_servicio" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pieza" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "nombre" varchar NOT NULL,
        CONSTRAINT "PK_pieza" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "tecnico"
      ADD COLUMN "especialidad" varchar NOT NULL DEFAULT 'general'
    `);
    await queryRunner.query(`
      ALTER TABLE "tecnico" ALTER COLUMN "especialidad" DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE "vehiculo" RENAME COLUMN "anio" TO "año"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "vehiculo" RENAME COLUMN "año" TO "anio"
    `);

    await queryRunner.query(`
      ALTER TABLE "tecnico" DROP COLUMN "especialidad"
    `);

    await queryRunner.query(`DROP TABLE "pieza"`);
    await queryRunner.query(`DROP TABLE "servicio"`);
    await queryRunner.query(`DROP TABLE "proveedor"`);
    await queryRunner.query(`DROP TABLE "material"`);
    await queryRunner.query(`DROP TABLE "categoria_material"`);
  }
}
