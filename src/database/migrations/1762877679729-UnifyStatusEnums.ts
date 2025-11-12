import { MigrationInterface, QueryRunner } from 'typeorm';

export class UnifyStatusEnums1762877679729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear el nuevo enum 
    await queryRunner.query(`
      CREATE TYPE "status_enum" AS ENUM(
        'pending', 'review_payment', 'approved', 'rejected', 
        'refund_in_transit', 'in_transit', 'discrepancy', 
        'cancelled', 'modified', 'refunded', 'completed'
      )
    `);

    // 2. Actualizar columnas para usar el nuevo enum
    // Primero quitar el valor por defecto
    await queryRunner.query(`
      ALTER TABLE "transactions" 
      ALTER COLUMN "final_status" DROP DEFAULT
    `);
    
    // Cambiar el tipo de columna
    await queryRunner.query(`
      ALTER TABLE "transactions" 
      ALTER COLUMN "final_status" TYPE "status_enum" 
      USING "final_status"::text::"status_enum"
    `);
    
    // Restaurar el valor por defecto
    await queryRunner.query(`
      ALTER TABLE "transactions" 
      ALTER COLUMN "final_status" SET DEFAULT 'pending'::"status_enum"
    `);

    // Hacer lo mismo para administracion_master
    await queryRunner.query(`
      ALTER TABLE "administracion_master" 
      ALTER COLUMN "status" DROP DEFAULT
    `);
    
    await queryRunner.query(`
      ALTER TABLE "administracion_master" 
      ALTER COLUMN "status" TYPE "status_enum" 
      USING "status"::text::"status_enum"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "administracion_master" 
      ALTER COLUMN "status" SET DEFAULT 'pending'::"status_enum"
    `);

    // administracion_status_log no tiene valor por defecto
    await queryRunner.query(`
      ALTER TABLE "administracion_status_log" 
      ALTER COLUMN "status" TYPE "status_enum" 
      USING "status"::text::"status_enum"
    `);

    // 3. Eliminar los enums antiguos
    await queryRunner.query(`DROP TYPE "transactions_final_status_enum"`);
    await queryRunner.query(`DROP TYPE "administracion_master_status_enum"`);
    await queryRunner.query(`DROP TYPE "administracion_status_log_status_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recrear los enums antiguos
    await queryRunner.query(`
      CREATE TYPE "transactions_final_status_enum" AS ENUM(
        'pending', 'review_payment', 'approved', 'rejected', 
        'refund_in_transit', 'in_transit', 'discrepancy', 
        'cancelled', 'modified', 'refunded', 'completed'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "administracion_master_status_enum" AS ENUM(
        'pending', 'review_payment', 'approved', 'rejected', 
        'refund_in_transit', 'in_transit', 'discrepancy', 
        'cancelled', 'modified', 'refunded', 'completed'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "administracion_status_log_status_enum" AS ENUM(
        'pending', 'review_payment', 'approved', 'rejected', 
        'refund_in_transit', 'in_transit', 'discrepancy', 
        'cancelled', 'modified', 'refunded', 'completed'
      )
    `);

    // Revertir las columnas
    await queryRunner.query(`
      ALTER TABLE "transactions" 
      ALTER COLUMN "final_status" TYPE "transactions_final_status_enum" 
      USING "final_status"::text::"transactions_final_status_enum"
    `);

    await queryRunner.query(`
      ALTER TABLE "administracion_master" 
      ALTER COLUMN "status" TYPE "administracion_master_status_enum" 
      USING "status"::text::"administracion_master_status_enum"
    `);

    await queryRunner.query(`
      ALTER TABLE "administracion_status_log" 
      ALTER COLUMN "status" TYPE "administracion_status_log_status_enum" 
      USING "status"::text::"administracion_status_log_status_enum"
    `);

    // Eliminar el enum unificado
    await queryRunner.query(`DROP TYPE "status_enum"`);
  }
}