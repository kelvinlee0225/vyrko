import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMovimientoInventario1783051968531 implements MigrationInterface {
  name = 'AddMovimientoInventario1783051968531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "movimiento_inventario" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "material_id" uuid NOT NULL,
        "proveedor_id" uuid,
        "usuario_id" uuid NOT NULL,
        "tipo_movimiento" varchar NOT NULL,
        "cantidad" decimal(10,2) NOT NULL,
        "motivo" varchar,
        CONSTRAINT "PK_movimiento_inventario" PRIMARY KEY ("id"),
        CONSTRAINT "FK_movimiento_inventario_material" FOREIGN KEY ("material_id") REFERENCES "material" ("id"),
        CONSTRAINT "FK_movimiento_inventario_proveedor" FOREIGN KEY ("proveedor_id") REFERENCES "proveedor" ("id"),
        CONSTRAINT "FK_movimiento_inventario_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movimiento_inventario"`);
  }
}
