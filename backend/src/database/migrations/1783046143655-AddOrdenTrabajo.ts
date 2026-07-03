import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrdenTrabajo1783046143655 implements MigrationInterface {
  name = 'AddOrdenTrabajo1783046143655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "orden_trabajo" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "cotizacion_id" uuid,
        "vehiculo_id" uuid NOT NULL,
        "tecnico_id" uuid NOT NULL,
        "estado" varchar NOT NULL DEFAULT 'recibido',
        "fecha_entrada" date NOT NULL,
        "fecha_entrega_estimada" date,
        "fecha_entrega_real" date,
        "descripcion_trabajo" text,
        CONSTRAINT "PK_orden_trabajo" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orden_trabajo_cotizacion" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizacion" ("id"),
        CONSTRAINT "FK_orden_trabajo_vehiculo" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculo" ("id"),
        CONSTRAINT "FK_orden_trabajo_tecnico" FOREIGN KEY ("tecnico_id") REFERENCES "tecnico" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "orden_trabajo_consumo" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "orden_trabajo_id" uuid NOT NULL,
        "material_id" uuid NOT NULL,
        "cantidad_real" decimal(10,2) NOT NULL,
        CONSTRAINT "PK_orden_trabajo_consumo" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orden_trabajo_consumo_orden_trabajo" FOREIGN KEY ("orden_trabajo_id") REFERENCES "orden_trabajo" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_orden_trabajo_consumo_material" FOREIGN KEY ("material_id") REFERENCES "material" ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orden_trabajo_consumo"`);
    await queryRunner.query(`DROP TABLE "orden_trabajo"`);
  }
}
