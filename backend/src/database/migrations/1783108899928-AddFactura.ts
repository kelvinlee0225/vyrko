import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFactura1783108899928 implements MigrationInterface {
  name = 'AddFactura1783108899928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "factura" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "cliente_id" uuid NOT NULL,
        "vehiculo_id" uuid,
        "cotizacion_id" uuid,
        "orden_trabajo_id" uuid,
        "numero" varchar NOT NULL,
        "estado" varchar NOT NULL DEFAULT 'pendiente',
        "fecha_emision" date NOT NULL,
        "fecha_vencimiento" date,
        "metodo_pago" varchar,
        "fecha_pago" date,
        "monto_pagado" decimal(12,2) NOT NULL DEFAULT 0,
        "descuento_global" decimal(12,2),
        "notas" text,
        CONSTRAINT "PK_factura" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_factura_numero" UNIQUE ("numero"),
        CONSTRAINT "FK_factura_cliente" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id"),
        CONSTRAINT "FK_factura_vehiculo" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculo" ("id"),
        CONSTRAINT "FK_factura_cotizacion" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizacion" ("id"),
        CONSTRAINT "FK_factura_orden_trabajo" FOREIGN KEY ("orden_trabajo_id") REFERENCES "orden_trabajo" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "factura_linea" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "factura_id" uuid NOT NULL,
        "servicio_id" uuid NOT NULL,
        "pieza_id" uuid,
        "descripcion" varchar NOT NULL,
        "cantidad" decimal(10,2) NOT NULL,
        "precio_unitario" decimal(12,2) NOT NULL,
        "itbis" decimal(12,2) NOT NULL,
        "descuento" decimal(12,2),
        CONSTRAINT "PK_factura_linea" PRIMARY KEY ("id"),
        CONSTRAINT "FK_factura_linea_factura" FOREIGN KEY ("factura_id") REFERENCES "factura" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_factura_linea_servicio" FOREIGN KEY ("servicio_id") REFERENCES "servicio" ("id"),
        CONSTRAINT "FK_factura_linea_pieza" FOREIGN KEY ("pieza_id") REFERENCES "pieza" ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "factura_linea"`);
    await queryRunner.query(`DROP TABLE "factura"`);
  }
}
