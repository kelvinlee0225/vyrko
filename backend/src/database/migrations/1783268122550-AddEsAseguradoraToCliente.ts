import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEsAseguradoraToCliente1783268122550 implements MigrationInterface {
  name = 'AddEsAseguradoraToCliente1783268122550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cliente"
      ADD COLUMN "es_aseguradora" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cliente"
      DROP COLUMN "es_aseguradora"
    `);
  }
}
