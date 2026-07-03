import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCotizacion1783043552605 implements MigrationInterface {
  name = 'AddCotizacion1783043552605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cotizacion" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "cliente_id" uuid NOT NULL,
        "vehiculo_id" uuid NOT NULL,
        "numero" varchar NOT NULL,
        "estado" varchar NOT NULL DEFAULT 'pendiente',
        "fecha_validez" date NOT NULL,
        "descuento_global" decimal(12,2),
        "notas" text,
        CONSTRAINT "PK_cotizacion" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_cotizacion_numero" UNIQUE ("numero"),
        CONSTRAINT "FK_cotizacion_cliente" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id"),
        CONSTRAINT "FK_cotizacion_vehiculo" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculo" ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "cotizacion_linea" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "cotizacion_id" uuid NOT NULL,
        "servicio_id" uuid NOT NULL,
        "pieza_id" uuid,
        "descripcion" varchar NOT NULL,
        "cantidad" decimal(10,2) NOT NULL,
        "precio_unitario" decimal(12,2) NOT NULL,
        "itbis" decimal(12,2) NOT NULL,
        "descuento" decimal(12,2),
        CONSTRAINT "PK_cotizacion_linea" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cotizacion_linea_cotizacion" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizacion" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_cotizacion_linea_servicio" FOREIGN KEY ("servicio_id") REFERENCES "servicio" ("id"),
        CONSTRAINT "FK_cotizacion_linea_pieza" FOREIGN KEY ("pieza_id") REFERENCES "pieza" ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cotizacion_linea"`);
    await queryRunner.query(`DROP TABLE "cotizacion"`);
  }
}
