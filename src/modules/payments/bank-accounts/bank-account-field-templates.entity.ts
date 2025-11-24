import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'bank_account_field_templates' })
export class BankAccountFieldTemplates {
  @PrimaryGeneratedColumn('uuid', { name: 'template_id' })
  templateId: string;

  @Column({ type: 'varchar', length: 3, nullable: false, name: 'country_code' })
  countryCode: string;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'field_key' })
  fieldKey: string;

  @Column({ type: 'varchar', length: 100, nullable: false, name: 'field_label' })
  fieldLabel: string;

  @Column({ type: 'boolean', default: false, name: 'is_required' })
  isRequired: boolean;

  @Column({ type: 'varchar', length: 30, default: 'text', nullable: false, name: 'field_type' })
  fieldType: string;

  @Column({ type: 'varchar', nullable: true, name: 'validation_pattern' })
  validationPattern: string;

  @Column({ type: 'int', default: 0, nullable: false, name: 'order_index' })
  orderIndex: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;
}
