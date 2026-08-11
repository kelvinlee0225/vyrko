import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndicadorFacturacionToFacturaLinea1786069197917 implements MigrationInterface {
  name = 'AddIndicadorFacturacionToFacturaLinea1786069197917';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "factura_linea"
        ADD COLUMN "indicador_facturacion" int
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "factura_linea"
        DROP COLUMN "indicador_facturacion"
    `);
  }
}
