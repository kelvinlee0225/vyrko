import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1782869686899 implements MigrationInterface {
  name = 'InitSchema1782869686899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE "rol" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "nombre" varchar NOT NULL,
        CONSTRAINT "PK_rol" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "cliente" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "nombre_razon_social" varchar NOT NULL,
        "tipo_cliente" varchar NOT NULL,
        "cedula_rnc" varchar,
        "telefono" varchar NOT NULL,
        "correo" varchar,
        "direccion" varchar,
        "limite_credito" decimal(12,2),
        "dias_credito" int,
        CONSTRAINT "PK_cliente" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tecnico" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "nombre" varchar NOT NULL,
        "activo" boolean NOT NULL,
        CONSTRAINT "PK_tecnico" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "usuario" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "rol_id" uuid NOT NULL,
        "nombre" varchar NOT NULL,
        "username" varchar NOT NULL,
        "password_hash" varchar NOT NULL,
        "activo" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_usuario" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_usuario_username" UNIQUE ("username"),
        CONSTRAINT "FK_usuario_rol" FOREIGN KEY ("rol_id") REFERENCES "rol" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "vehiculo" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "cliente_id" uuid NOT NULL,
        "placa" varchar NOT NULL,
        "marca" varchar NOT NULL,
        "modelo" varchar NOT NULL,
        "anio" int NOT NULL,
        "color" varchar NOT NULL,
        "vin_chasis" varchar,
        CONSTRAINT "PK_vehiculo" PRIMARY KEY ("id"),
        CONSTRAINT "FK_vehiculo_cliente" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "empresa" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "nombre" varchar NOT NULL,
        "rnc" varchar NOT NULL,
        "direccion" varchar NOT NULL,
        "telefono" varchar NOT NULL,
        "correo" varchar NOT NULL,
        CONSTRAINT "PK_empresa" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "empresa"`);
    await queryRunner.query(`DROP TABLE "vehiculo"`);
    await queryRunner.query(`DROP TABLE "usuario"`);
    await queryRunner.query(`DROP TABLE "tecnico"`);
    await queryRunner.query(`DROP TABLE "cliente"`);
    await queryRunner.query(`DROP TABLE "rol"`);
  }
}
