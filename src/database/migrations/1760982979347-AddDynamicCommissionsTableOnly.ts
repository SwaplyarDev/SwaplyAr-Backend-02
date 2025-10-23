import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class AddDynamicCommissionsTableOnly1760982979347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Asegura la extensión para UUIDs (por si no existe)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Crear tabla dynamic_commissions
    await queryRunner.createTable(
      new Table({
        name: 'dynamic_commissions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'from_platform',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'to_platform',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'commission_rate',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Crear restricción única
    await queryRunner.createUniqueConstraint(
      'dynamic_commissions',
      new TableUnique({
        name: 'UQ_dynamic_commissions_from_to',
        columnNames: ['from_platform', 'to_platform'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dynamic_commissions');
  }
}
