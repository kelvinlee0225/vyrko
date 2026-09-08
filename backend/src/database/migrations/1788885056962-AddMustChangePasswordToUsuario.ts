import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMustChangePasswordToUsuario1788885056962
  implements MigrationInterface
{
  name = 'AddMustChangePasswordToUsuario1788885056962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario"
      ADD COLUMN "must_change_password" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario" DROP COLUMN "must_change_password"
    `);
  }
}
