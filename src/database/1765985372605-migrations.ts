import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1765985372605 implements MigrationInterface {
  name = 'Migrations1765985372605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_socials" ("user_socials_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "whatsapp_number" character varying, "facebook" character varying, "instagram" character varying, "tiktok" character varying, "twitter_x" character varying, "snapchat" character varying, "linkedin" character varying, "youtube" character varying, "pinterest" character varying, "user_profile_id" uuid, CONSTRAINT "REL_52aa4379b581fd0a16a89a0918" UNIQUE ("user_profile_id"), CONSTRAINT "PK_7c6cb2e7d47e86d5776b9b368d8" PRIMARY KEY ("user_socials_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_categories" ("user_category_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_category" character varying NOT NULL, "user_requirements" character varying NOT NULL, CONSTRAINT "PK_b5305591c9f79fcc9909dde552d" PRIMARY KEY ("user_category_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_profiles_gender_enum" AS ENUM('M', 'F', 'O')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("user_profile_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "nickName" character varying, "email" character varying NOT NULL, "identification" character varying, "phone" character varying, "birthday" date, "age" integer, "gender" "public"."user_profiles_gender_enum" DEFAULT 'M', "last_activity" TIMESTAMP, "profile_picture_url" character varying, "user_id" uuid, "user_category_id" uuid, CONSTRAINT "REL_6ca9503d77ae39b4b5a6cc3ba8" UNIQUE ("user_id"), CONSTRAINT "PK_cba9489d59d3f6254e3af2a8a23" PRIMARY KEY ("user_profile_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_alternative_emails" ("user_alternative_email_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alternative_email" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_e5c2f4857ba0d0ecfa1ddbd92ea" PRIMARY KEY ("user_alternative_email_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_locations" ("user_location_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "department" character varying NOT NULL, "postal_code" character varying NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "user_id" uuid, CONSTRAINT "PK_25f91e939378eb6028868baf0ae" PRIMARY KEY ("user_location_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_contacts" ("user_contact_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_9636da2a0471db068889ad23940" PRIMARY KEY ("user_contact_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_bans" ("user_ban_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" character varying NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "is_permanent" boolean NOT NULL, "is_active" boolean NOT NULL, "user_id" uuid, CONSTRAINT "PK_c303745e5445d520c2b2fcd5efd" PRIMARY KEY ("user_ban_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_verification_attempts" ("attempt_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "verification_id" uuid NOT NULL, "document_front" character varying NOT NULL, "document_back" character varying NOT NULL, "selfie_image" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_84908537350d46f47b72cf1af0a" PRIMARY KEY ("attempt_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_verification_verification_status_enum" AS ENUM('pending', 'verified', 'rejected', 'resend-data')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_verification" ("verification_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document_front" character varying NOT NULL, "document_back" character varying NOT NULL, "selfie_image" character varying NOT NULL, "verification_status" "public"."user_verification_verification_status_enum" NOT NULL DEFAULT 'pending', "note_rejection" character varying, "verified_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_863bc8cfcdb1ea11736502c8f34" PRIMARY KEY ("verification_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("refresh_token_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refresh_token" character varying NOT NULL, "expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL, "user_id" uuid, CONSTRAINT "PK_38622f85836f4e77b3230e39f31" PRIMARY KEY ("refresh_token_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp_codes" ("otp_code_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_id" character varying, "code" character varying NOT NULL, "expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "email" character varying, "user_id" uuid, CONSTRAINT "PK_386398666bbacd564c1cb92ec00" PRIMARY KEY ("otp_code_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discount_codes" ("discount_code_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "value" numeric(15,2) NOT NULL, "currency_code" character varying NOT NULL, "valid_from" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b967edd0d46547d4a92b4a1c6b3" UNIQUE ("code"), CONSTRAINT "PK_fadc09294961ba8a3f08205fe28" PRIMARY KEY ("discount_code_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "proof_of_payments" ("payments_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "img_url" character varying NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" character varying(10), CONSTRAINT "PK_e60826939afe2b6d24ed4bf3fcc" PRIMARY KEY ("payments_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_proof_of_payments_created_at" ON "proof_of_payments" ("create_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_proof_of_payments_transaction_id" ON "proof_of_payments" ("transaction_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_proof_of_payments_tx_created_at" ON "proof_of_payments" ("transaction_id", "create_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_methods_platform_enum" AS ENUM('bank', 'pix', 'virtual_bank', 'receiver_crypto')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_methods" ("payment_method_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "platform" "public"."payment_methods_platform_enum" NOT NULL, "method" character varying(50) NOT NULL, "type" character varying(50), "currency" character varying, "bank_name" character varying, "send_method_key" character varying, "send_method_value" character varying, "document_type" character varying, "document_value" character varying, "email_account" character varying, "transfer_code" character varying, "network" character varying, "wallet" character varying, "pix_id" character varying, "pix_key" character varying, "pix_value" character varying, "cpf" character varying(14), CONSTRAINT "PK_397415468d59f5743a83c6c7bef" PRIMARY KEY ("payment_method_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_payment_methods_method" ON "payment_methods" ("method") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_payment_methods_platform_method" ON "payment_methods" ("platform", "method") `,
    );
    await queryRunner.query(`CREATE INDEX "idx_pix_id" ON "payment_methods" ("pix_id") `);
    await queryRunner.query(`CREATE INDEX "idx_pix_key" ON "payment_methods" ("pix_key") `);
    await queryRunner.query(`CREATE INDEX "idx_pix_cpf" ON "payment_methods" ("cpf") `);
    await queryRunner.query(
      `CREATE TABLE "financial_accounts" ("financial_account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "created_by" character varying, "phone_number" character varying, "type" character varying NOT NULL, "payment_method_id" uuid NOT NULL, CONSTRAINT "REL_ef910094abc02f4861e35c4011" UNIQUE ("payment_method_id"), CONSTRAINT "PK_052999803d2720c5c5c98f6b8c2" PRIMARY KEY ("financial_account_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_financial_accounts_first_name" ON "financial_accounts" ("first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_financial_accounts_last_name" ON "financial_accounts" ("last_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_financial_accounts_name" ON "financial_accounts" ("last_name", "first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef910094abc02f4861e35c4011" ON "financial_accounts" ("payment_method_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sender_fin_accounts_created_by" ON "financial_accounts" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sender_fin_accounts_phone" ON "financial_accounts" ("phone_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ecdcf15bb302e00c5b8590802" ON "financial_accounts" ("type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "amount" ("amount_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amountSent" numeric(15,2) NOT NULL, "currencySent" character varying NOT NULL, "amountReceived" numeric(15,2) NOT NULL, "currencyReceived" character varying NOT NULL, "received" boolean NOT NULL, CONSTRAINT "PK_fb1f9159cc149775fc9e9be9c75" PRIMARY KEY ("amount_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("note_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attachments" text array, "message" character varying NOT NULL, "section" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" character varying(10), CONSTRAINT "REL_1cd1479d6f04cc72659f5921e6" UNIQUE ("transaction_id"), CONSTRAINT "PK_77f245eb03df887f6f03c57f7f5" PRIMARY KEY ("note_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "regrets" ("regret_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "description" character varying NOT NULL, "transaction_id" character varying(10), "payment_info_id" uuid, CONSTRAINT "REL_a877ca7e6cddbe5ae8cf98450a" UNIQUE ("transaction_id"), CONSTRAINT "REL_8dd9ff9e0708f17eb60d0fe874" UNIQUE ("payment_info_id"), CONSTRAINT "PK_147d7c8a8e3f8742fa022faf667" PRIMARY KEY ("regret_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_final_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'cancelled', 'modified', 'refunded', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("transaction_id" character varying(10) NOT NULL, "country_transaction" character varying NOT NULL, "message" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "final_status" "public"."transactions_final_status_enum" NOT NULL DEFAULT 'pending', "amount_value" numeric(18,2), "amount_currency" character varying(3), "isNoteVerified" boolean NOT NULL DEFAULT false, "noteVerificationExpiresAt" TIMESTAMP, "sender_account_id" uuid, "receiver_account_id" uuid, "note_id" uuid, "regret_id" uuid, "amount_id" uuid, CONSTRAINT "REL_c3f53f3fa7100cb3fbd2c09c6e" UNIQUE ("note_id"), CONSTRAINT "REL_e006fc4547b2051900939febb6" UNIQUE ("regret_id"), CONSTRAINT "REL_2ca3a8b59e96c792e4ec3c0dc8" UNIQUE ("amount_id"), CONSTRAINT "PK_9162bf9ab4e31961a8f7932974c" PRIMARY KEY ("transaction_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transactions_country_transaction" ON "transactions" ("country_transaction") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transactions_created_at" ON "transactions" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transactions_final_status" ON "transactions" ("final_status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transactions_sender_account_id" ON "transactions" ("sender_account_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transactions_receiver_account_id" ON "transactions" ("receiver_account_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_discounts" ("user_discount_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "used_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "discount_code_id" uuid, CONSTRAINT "PK_7b3d32ad25d2c778d749f43bf0a" PRIMARY KEY ("user_discount_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_rewards_ledger" ("ledger_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric NOT NULL DEFAULT '0', "stars" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_96bbda5ec76e8ff391a2bb3497" UNIQUE ("user_id"), CONSTRAINT "PK_c5c7b28c2ee4d8c0285cb65cd3d" PRIMARY KEY ("ledger_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("role_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"), CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_platforms" ("payment_platform_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(50) NOT NULL, "title" character varying(100) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e678f0a05413cf27b7df659a4c6" UNIQUE ("code"), CONSTRAINT "PK_0e0bf75de755ff2e34d8e69ee17" PRIMARY KEY ("payment_platform_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "countries" ("country_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character(3) NOT NULL, "name" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b47cbb5311bad9c9ae17b8c1eda" UNIQUE ("code"), CONSTRAINT "PK_9886b09af4b4724d595b2e3923c" PRIMARY KEY ("country_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "crypto_networks" ("crypto_network_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(20) NOT NULL, "title" character varying(100) NOT NULL, "logo_url" character varying, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_bfa8d74360ab815db95d0846301" UNIQUE ("code"), CONSTRAINT "PK_40f8e6af65c9d7fe6886dce3f6a" PRIMARY KEY ("crypto_network_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "crypto_accounts" ("crypto_account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "wallet_address" character varying NOT NULL, "tag_or_memo" character varying, "owner_type" character varying(20) NOT NULL DEFAULT 'user', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "payment_provider_id" uuid NOT NULL, "crypto_network_id" uuid NOT NULL, "currency_id" uuid, "created_by" uuid NOT NULL, CONSTRAINT "PK_2d6f6d5c6f7414fcf07d02dc896" PRIMARY KEY ("crypto_account_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "currencies" ("currency_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(10) NOT NULL, "name" character varying(100) NOT NULL, "symbol" character varying(10) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_8ea4cc194d333e79b3a8e8a9a24" PRIMARY KEY ("currency_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "virtual_bank_accounts" ("virtual_bank_account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email_account" character varying NOT NULL, "account_alias" character varying, "currency_id" uuid, "owner_type" character varying(20) NOT NULL DEFAULT 'user', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "payment_provider_id" uuid NOT NULL, "created_by" uuid NOT NULL, CONSTRAINT "PK_d90747a442692aa07c41b832917" PRIMARY KEY ("virtual_bank_account_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_providers" ("payment_provider_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(50) NOT NULL, "country_id" uuid, "logo_url" character varying, "operation_type" character varying(10) NOT NULL DEFAULT 'both', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "payment_platform_id" uuid NOT NULL, CONSTRAINT "UQ_3b92bdeea5c610e84052154ef25" UNIQUE ("code"), CONSTRAINT "UQ_768a29dc3f86bee01e0cfc12b3e" UNIQUE ("payment_platform_id", "code"), CONSTRAINT "PK_ae5be9356ec8fd4afaa584f10f0" PRIMARY KEY ("payment_provider_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bank_account_details" ("bank_account_detail_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "field_key" character varying(50) NOT NULL, "field_label" character varying(100) NOT NULL, "field_value" character varying NOT NULL, "is_encrypted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "bank_account_id" uuid NOT NULL, CONSTRAINT "PK_e32bb3fa4b2c57977bf8aada6e8" PRIMARY KEY ("bank_account_detail_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bank_accounts" ("bank_account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country_id" uuid NOT NULL, "holder_name" character varying NOT NULL, "document_type" character varying, "document_value" character varying, "bank_name" character varying, "account_number" character varying, "iban" character varying, "swift" character varying, "currency_id" uuid, "owner_type" character varying(20) NOT NULL DEFAULT 'user', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "payment_provider_id" uuid NOT NULL, "created_by" uuid NOT NULL, CONSTRAINT "PK_ba3381b91f6f67fed016e798296" PRIMARY KEY ("bank_account_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "terms_accepted" boolean NOT NULL DEFAULT false, "member_code" character varying(8) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "validated_at" TIMESTAMP WITH TIME ZONE, "is_active" boolean NOT NULL DEFAULT true, "is_validated" boolean NOT NULL DEFAULT false, "user_validated" boolean NOT NULL DEFAULT false, "refreshToken" character varying, "role_code" character varying, "role_name" character varying, "role_description" character varying, CONSTRAINT "UQ_54edc787000bbce448a70bc3e83" UNIQUE ("member_code"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_questions" ("user_question_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_20f9b11d3e3916300715c2dc18f" PRIMARY KEY ("user_question_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_account" ("account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_name" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" boolean NOT NULL DEFAULT true, "user_id" character varying NOT NULL, "financial_account_id" uuid, CONSTRAINT "REL_c6412112ab4eb46363a87b2767" UNIQUE ("financial_account_id"), CONSTRAINT "PK_7db53a014418432811b1eb1aa97" PRIMARY KEY ("account_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "abandoned_transactions" ("abandoned_transaction_id" character varying(10) NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_596b224b2cdf41add5186844cdf" PRIMARY KEY ("abandoned_transaction_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "qualifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_id" character varying NOT NULL, "stars_amount" integer NOT NULL, "note" character varying, CONSTRAINT "PK_9ed4d526ac3b76ba3f1c1080433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bank_account_field_templates" ("template_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country_code" character varying(3) NOT NULL, "field_key" character varying(50) NOT NULL, "field_label" character varying(100) NOT NULL, "is_required" boolean NOT NULL DEFAULT false, "field_type" character varying(30) NOT NULL DEFAULT 'text', "validation_pattern" character varying, "order_index" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e63d8e207b61e25423a420a1b87" PRIMARY KEY ("template_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, "user_id" character varying, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administracion_master_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'cancelled', 'modified', 'refunded', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "administracion_master" ("transaction_id" character varying(10) NOT NULL, "admin_user_id" uuid NOT NULL, "status" "public"."administracion_master_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "begin_transaction" TIMESTAMP, "end_transaction" TIMESTAMP, "transfer_received" text, CONSTRAINT "PK_07c46f45239be5da141ac02a58f" PRIMARY KEY ("transaction_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administracion_status_log_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'cancelled', 'modified', 'refunded', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "administracion_status_log" ("log_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."administracion_status_log_status_enum" NOT NULL, "changed_at" TIMESTAMP NOT NULL DEFAULT now(), "message" text, "changed_by_admin_id" uuid NOT NULL, "additionalData" jsonb, "transaction_id" character varying(10), CONSTRAINT "PK_93c3d98ede4fd3ac21a4f9d021f" PRIMARY KEY ("log_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "financial_account" ("financial_account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payment_platform_id" uuid NOT NULL, "reference_id" uuid NOT NULL, "user_id" uuid NOT NULL, "owner_type" character varying(20) NOT NULL, "created_by" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_407127784a7bb7be0c3187a2c0e" PRIMARY KEY ("financial_account_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dynamic_commissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_platform" character varying(20) NOT NULL, "to_platform" character varying(20) NOT NULL, "commission_rate" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0c6594adb488a7fe97a77a4b082" UNIQUE ("from_platform", "to_platform"), CONSTRAINT "PK_3ec45caa1179a1ece569034f39b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_user_discounts" ("transaction_id" character varying(10) NOT NULL, "user_discount_id" uuid NOT NULL, CONSTRAINT "PK_6377e5783cf2c1ca0037af3ac90" PRIMARY KEY ("transaction_id", "user_discount_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d526dd3f45bb11e3982dcadb45" ON "transaction_user_discounts" ("transaction_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d935195f295a5ceb932cc21fb" ON "transaction_user_discounts" ("user_discount_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "countries_currencies" ("country_id" uuid NOT NULL, "currency_id" uuid NOT NULL, CONSTRAINT "PK_a3c60f204f5b0b531c8bd080f19" PRIMARY KEY ("country_id", "currency_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_354f600acd6005d406f2a80420" ON "countries_currencies" ("country_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a6f88f7324a0bd473829e07ea0" ON "countries_currencies" ("currency_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "provider_currencies" ("provider_id" uuid NOT NULL, "currency_id" uuid NOT NULL, CONSTRAINT "PK_d5616ce1cfdb67ff9a603c62c80" PRIMARY KEY ("provider_id", "currency_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ee53258571c65d6e6e914ac801" ON "provider_currencies" ("provider_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_abfd0200bd6cbf9400014c0713" ON "provider_currencies" ("currency_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_financial_accounts_first_name"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "first_name"`);
    await queryRunner.query(`DROP INDEX "public"."idx_financial_accounts_last_name"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "last_name"`);
    await queryRunner.query(`DROP INDEX "public"."idx_sender_fin_accounts_phone"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "phone_number"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0ecdcf15bb302e00c5b8590802"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ef910094abc02f4861e35c4011"`);
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" DROP CONSTRAINT "REL_ef910094abc02f4861e35c4011"`,
    );
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "payment_method_id"`);
    await queryRunner.query(`ALTER TABLE "payment_providers" DROP COLUMN "country_id"`);
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "phone_number" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "payment_method_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD CONSTRAINT "UQ_ef910094abc02f4861e35c4011f" UNIQUE ("payment_method_id")`,
    );
    await queryRunner.query(`ALTER TABLE "financial_accounts" ADD "reference_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "owner_type" character varying(20) NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "payment_platform_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "payment_providers" ADD "country_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "payment_providers" ADD "country_code" character varying(3)`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_sender_fin_accounts_created_by"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" ADD "created_by" uuid`);
    await queryRunner.query(
      `CREATE INDEX "idx_financial_accounts_first_name" ON "financial_accounts" ("first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_financial_accounts_last_name" ON "financial_accounts" ("last_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef910094abc02f4861e35c4011" ON "financial_accounts" ("payment_method_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sender_fin_accounts_created_by" ON "financial_accounts" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sender_fin_accounts_phone" ON "financial_accounts" ("phone_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ecdcf15bb302e00c5b8590802" ON "financial_accounts" ("type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_socials" ADD CONSTRAINT "FK_52aa4379b581fd0a16a89a09184" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("user_profile_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_d4dd288ba30d631f6f0442ca531" FOREIGN KEY ("user_category_id") REFERENCES "user_categories"("user_category_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_alternative_emails" ADD CONSTRAINT "FK_5e13ad797700003c8da5bd56164" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD CONSTRAINT "FK_437edca703095b237b5bdb35e22" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_contacts" ADD CONSTRAINT "FK_a81491e712124db8d5423803ecb" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bans" ADD CONSTRAINT "FK_a142c9954b2fd911b3e7ea8c307" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification_attempts" ADD CONSTRAINT "FK_b004467f274428dc2e4f7d7b2db" FOREIGN KEY ("verification_id") REFERENCES "user_verification"("verification_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD CONSTRAINT "FK_3d40c1993bffba775f0ffad0cae" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_codes" ADD CONSTRAINT "FK_318b850fc020b1e0f8670f66e12" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_of_payments" ADD CONSTRAINT "FK_08c13e97528e9dacc5e5f57eac5" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD CONSTRAINT "FK_ef910094abc02f4861e35c4011f" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("payment_method_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_1cd1479d6f04cc72659f5921e6f" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regrets" ADD CONSTRAINT "FK_a877ca7e6cddbe5ae8cf98450ad" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regrets" ADD CONSTRAINT "FK_8dd9ff9e0708f17eb60d0fe8742" FOREIGN KEY ("payment_info_id") REFERENCES "proof_of_payments"("payments_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_ab04d6f62bdfac21c1e3c04a33d" FOREIGN KEY ("sender_account_id") REFERENCES "financial_accounts"("financial_account_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_55c3596e9965fdbbf0da0ff8c29" FOREIGN KEY ("receiver_account_id") REFERENCES "financial_accounts"("financial_account_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_c3f53f3fa7100cb3fbd2c09c6e6" FOREIGN KEY ("note_id") REFERENCES "notes"("note_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e006fc4547b2051900939febb6c" FOREIGN KEY ("regret_id") REFERENCES "regrets"("regret_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_2ca3a8b59e96c792e4ec3c0dc8a" FOREIGN KEY ("amount_id") REFERENCES "amount"("amount_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_discounts" ADD CONSTRAINT "FK_9710deded29316fe5d81cb3e89c" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_discounts" ADD CONSTRAINT "FK_d647dbf1a5357a381559345a147" FOREIGN KEY ("discount_code_id") REFERENCES "discount_codes"("discount_code_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_rewards_ledger" ADD CONSTRAINT "FK_96bbda5ec76e8ff391a2bb34972" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD CONSTRAINT "FK_d5e7a054bdcad48ee067a829199" FOREIGN KEY ("payment_platform_id") REFERENCES "payment_platforms"("payment_platform_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD CONSTRAINT "FK_5d25a19121763620e0ed1f1e112" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" ADD CONSTRAINT "FK_1ec23a1cddc89978360841cd327" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" ADD CONSTRAINT "FK_6c55b1d89977743be0b281409b9" FOREIGN KEY ("payment_provider_id") REFERENCES "payment_providers"("payment_provider_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" ADD CONSTRAINT "FK_980fb2c8f5d6f8b080bb51deedc" FOREIGN KEY ("crypto_network_id") REFERENCES "crypto_networks"("crypto_network_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" ADD CONSTRAINT "FK_04086377964373a4249d33bdd43" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" ADD CONSTRAINT "FK_3df0b2731d4f8415d69671950c2" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank_accounts" ADD CONSTRAINT "FK_1babeaf58c9ae77fd45290cf02f" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank_accounts" ADD CONSTRAINT "FK_585025a9afcf9fb2f09366dfcd8" FOREIGN KEY ("payment_provider_id") REFERENCES "payment_providers"("payment_provider_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank_accounts" ADD CONSTRAINT "FK_2df8168a94ee4676ce794b384d8" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank_accounts" ADD CONSTRAINT "FK_d44e938e9cacfebd4ccfac1e7ca" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_providers" ADD CONSTRAINT "FK_0a3700d79cc8bfe4d852d99ee20" FOREIGN KEY ("payment_platform_id") REFERENCES "payment_platforms"("payment_platform_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_providers" ADD CONSTRAINT "FK_af7bad91e39bfff30db918c1c57" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account_details" ADD CONSTRAINT "FK_e7c294492dbdf3638ac1d92411a" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("bank_account_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_29146c4a8026c77c712e01d922b" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_d918bf221dc38f45d788b1a779d" FOREIGN KEY ("payment_provider_id") REFERENCES "payment_providers"("payment_provider_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_f75f4cb4cf1f147636d9338a9c0" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_ec70be9831757dbb667ee7f5d73" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_7046dc30802b1ed936f5d1c8f3b" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_questions" ADD CONSTRAINT "FK_7df0da6b1f94c132a9fbed5155c" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account" ADD CONSTRAINT "FK_c6412112ab4eb46363a87b2767c" FOREIGN KEY ("financial_account_id") REFERENCES "financial_accounts"("financial_account_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administracion_master" ADD CONSTRAINT "FK_07c46f45239be5da141ac02a58f" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administracion_master" ADD CONSTRAINT "FK_4e5dbc8b447674f7ecc2dd35155" FOREIGN KEY ("admin_user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administracion_status_log" ADD CONSTRAINT "FK_d76daa9604bb63d1cd3d76ea2c0" FOREIGN KEY ("transaction_id") REFERENCES "administracion_master"("transaction_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "administracion_status_log" ADD CONSTRAINT "FK_d925420f2e01382ff12b1623c23" FOREIGN KEY ("changed_by_admin_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_user_discounts" ADD CONSTRAINT "FK_d526dd3f45bb11e3982dcadb45c" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_user_discounts" ADD CONSTRAINT "FK_4d935195f295a5ceb932cc21fbc" FOREIGN KEY ("user_discount_id") REFERENCES "user_discounts"("user_discount_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries_currencies" ADD CONSTRAINT "FK_354f600acd6005d406f2a804202" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries_currencies" ADD CONSTRAINT "FK_a6f88f7324a0bd473829e07ea0e" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_currencies" ADD CONSTRAINT "FK_ee53258571c65d6e6e914ac801b" FOREIGN KEY ("provider_id") REFERENCES "payment_providers"("payment_provider_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_currencies" ADD CONSTRAINT "FK_abfd0200bd6cbf9400014c07137" FOREIGN KEY ("currency_id") REFERENCES "currencies"("currency_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_currencies" DROP CONSTRAINT "FK_abfd0200bd6cbf9400014c07137"`,
    );
    await queryRunner.query(
      `ALTER TABLE "provider_currencies" DROP CONSTRAINT "FK_ee53258571c65d6e6e914ac801b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries_currencies" DROP CONSTRAINT "FK_a6f88f7324a0bd473829e07ea0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "countries_currencies" DROP CONSTRAINT "FK_354f600acd6005d406f2a804202"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_user_discounts" DROP CONSTRAINT "FK_4d935195f295a5ceb932cc21fbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_user_discounts" DROP CONSTRAINT "FK_d526dd3f45bb11e3982dcadb45c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administracion_status_log" DROP CONSTRAINT "FK_d925420f2e01382ff12b1623c23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administracion_status_log" DROP CONSTRAINT "FK_d76daa9604bb63d1cd3d76ea2c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administracion_master" DROP CONSTRAINT "FK_4e5dbc8b447674f7ecc2dd35155"`,
    );
    await queryRunner.query(
      `ALTER TABLE "administracion_master" DROP CONSTRAINT "FK_07c46f45239be5da141ac02a58f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account" DROP CONSTRAINT "FK_c6412112ab4eb46363a87b2767c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_questions" DROP CONSTRAINT "FK_7df0da6b1f94c132a9fbed5155c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_7046dc30802b1ed936f5d1c8f3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_ec70be9831757dbb667ee7f5d73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_f75f4cb4cf1f147636d9338a9c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_d918bf221dc38f45d788b1a779d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_29146c4a8026c77c712e01d922b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account_details" DROP CONSTRAINT "FK_e7c294492dbdf3638ac1d92411a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_providers" DROP CONSTRAINT "FK_af7bad91e39bfff30db918c1c57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_providers" DROP CONSTRAINT "FK_0a3700d79cc8bfe4d852d99ee20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank_accounts" DROP CONSTRAINT "FK_d44e938e9cacfebd4ccfac1e7ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank_accounts" DROP CONSTRAINT "FK_2df8168a94ee4676ce794b384d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank_accounts" DROP CONSTRAINT "FK_585025a9afcf9fb2f09366dfcd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank_accounts" DROP CONSTRAINT "FK_1babeaf58c9ae77fd45290cf02f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" DROP CONSTRAINT "FK_3df0b2731d4f8415d69671950c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" DROP CONSTRAINT "FK_04086377964373a4249d33bdd43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" DROP CONSTRAINT "FK_980fb2c8f5d6f8b080bb51deedc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" DROP CONSTRAINT "FK_6c55b1d89977743be0b281409b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_accounts" DROP CONSTRAINT "FK_1ec23a1cddc89978360841cd327"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" DROP CONSTRAINT "FK_5d25a19121763620e0ed1f1e112"`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" DROP CONSTRAINT "FK_d5e7a054bdcad48ee067a829199"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_rewards_ledger" DROP CONSTRAINT "FK_96bbda5ec76e8ff391a2bb34972"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_discounts" DROP CONSTRAINT "FK_d647dbf1a5357a381559345a147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_discounts" DROP CONSTRAINT "FK_9710deded29316fe5d81cb3e89c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_2ca3a8b59e96c792e4ec3c0dc8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e006fc4547b2051900939febb6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_c3f53f3fa7100cb3fbd2c09c6e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_55c3596e9965fdbbf0da0ff8c29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_ab04d6f62bdfac21c1e3c04a33d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regrets" DROP CONSTRAINT "FK_8dd9ff9e0708f17eb60d0fe8742"`,
    );
    await queryRunner.query(
      `ALTER TABLE "regrets" DROP CONSTRAINT "FK_a877ca7e6cddbe5ae8cf98450ad"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_1cd1479d6f04cc72659f5921e6f"`);
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" DROP CONSTRAINT "FK_ef910094abc02f4861e35c4011f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "proof_of_payments" DROP CONSTRAINT "FK_08c13e97528e9dacc5e5f57eac5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_codes" DROP CONSTRAINT "FK_318b850fc020b1e0f8670f66e12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP CONSTRAINT "FK_3d40c1993bffba775f0ffad0cae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification_attempts" DROP CONSTRAINT "FK_b004467f274428dc2e4f7d7b2db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bans" DROP CONSTRAINT "FK_a142c9954b2fd911b3e7ea8c307"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_contacts" DROP CONSTRAINT "FK_a81491e712124db8d5423803ecb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP CONSTRAINT "FK_437edca703095b237b5bdb35e22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_alternative_emails" DROP CONSTRAINT "FK_5e13ad797700003c8da5bd56164"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_d4dd288ba30d631f6f0442ca531"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_socials" DROP CONSTRAINT "FK_52aa4379b581fd0a16a89a09184"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_0ecdcf15bb302e00c5b8590802"`);
    await queryRunner.query(`DROP INDEX "public"."idx_sender_fin_accounts_phone"`);
    await queryRunner.query(`DROP INDEX "public"."idx_sender_fin_accounts_created_by"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ef910094abc02f4861e35c4011"`);
    await queryRunner.query(`DROP INDEX "public"."idx_financial_accounts_last_name"`);
    await queryRunner.query(`DROP INDEX "public"."idx_financial_accounts_first_name"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" ADD "created_by" character varying`);
    await queryRunner.query(
      `CREATE INDEX "idx_sender_fin_accounts_created_by" ON "financial_accounts" ("created_by") `,
    );
    await queryRunner.query(`ALTER TABLE "payment_providers" DROP COLUMN "country_code"`);
    await queryRunner.query(`ALTER TABLE "payment_providers" DROP COLUMN "country_id"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "payment_platform_id"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "owner_type"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "reference_id"`);
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" DROP CONSTRAINT "UQ_ef910094abc02f4861e35c4011f"`,
    );
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "payment_method_id"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "phone_number"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "financial_accounts" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "payment_providers" ADD "country_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "payment_method_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD CONSTRAINT "REL_ef910094abc02f4861e35c4011" UNIQUE ("payment_method_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef910094abc02f4861e35c4011" ON "financial_accounts" ("payment_method_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ecdcf15bb302e00c5b8590802" ON "financial_accounts" ("type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "phone_number" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sender_fin_accounts_phone" ON "financial_accounts" ("phone_number") `,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_financial_accounts_last_name" ON "financial_accounts" ("last_name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_financial_accounts_first_name" ON "financial_accounts" ("first_name") `,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_abfd0200bd6cbf9400014c0713"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ee53258571c65d6e6e914ac801"`);
    await queryRunner.query(`DROP TABLE "provider_currencies"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a6f88f7324a0bd473829e07ea0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_354f600acd6005d406f2a80420"`);
    await queryRunner.query(`DROP TABLE "countries_currencies"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4d935195f295a5ceb932cc21fb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d526dd3f45bb11e3982dcadb45"`);
    await queryRunner.query(`DROP TABLE "transaction_user_discounts"`);
    await queryRunner.query(`DROP TABLE "dynamic_commissions"`);
    await queryRunner.query(`DROP TABLE "financial_account"`);
    await queryRunner.query(`DROP TABLE "administracion_status_log"`);
    await queryRunner.query(`DROP TYPE "public"."administracion_status_log_status_enum"`);
    await queryRunner.query(`DROP TABLE "administracion_master"`);
    await queryRunner.query(`DROP TYPE "public"."administracion_master_status_enum"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "bank_account_field_templates"`);
    await queryRunner.query(`DROP TABLE "qualifications"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "abandoned_transactions"`);
    await queryRunner.query(`DROP TABLE "user_account"`);
    await queryRunner.query(`DROP TABLE "user_questions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "bank_accounts"`);
    await queryRunner.query(`DROP TABLE "bank_account_details"`);
    await queryRunner.query(`DROP TABLE "payment_providers"`);
    await queryRunner.query(`DROP TABLE "virtual_bank_accounts"`);
    await queryRunner.query(`DROP TABLE "currencies"`);
    await queryRunner.query(`DROP TABLE "crypto_accounts"`);
    await queryRunner.query(`DROP TABLE "crypto_networks"`);
    await queryRunner.query(`DROP TABLE "countries"`);
    await queryRunner.query(`DROP TABLE "payment_platforms"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "user_rewards_ledger"`);
    await queryRunner.query(`DROP TABLE "user_discounts"`);
    await queryRunner.query(`DROP INDEX "public"."idx_transactions_receiver_account_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_transactions_sender_account_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_transactions_final_status"`);
    await queryRunner.query(`DROP INDEX "public"."idx_transactions_created_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_transactions_country_transaction"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_final_status_enum"`);
    await queryRunner.query(`DROP TABLE "regrets"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "amount"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0ecdcf15bb302e00c5b8590802"`);
    await queryRunner.query(`DROP INDEX "public"."idx_sender_fin_accounts_phone"`);
    await queryRunner.query(`DROP INDEX "public"."idx_sender_fin_accounts_created_by"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ef910094abc02f4861e35c4011"`);
    await queryRunner.query(`DROP INDEX "public"."idx_financial_accounts_name"`);
    await queryRunner.query(`DROP INDEX "public"."idx_financial_accounts_last_name"`);
    await queryRunner.query(`DROP INDEX "public"."idx_financial_accounts_first_name"`);
    await queryRunner.query(`DROP TABLE "financial_accounts"`);
    await queryRunner.query(`DROP INDEX "public"."idx_pix_cpf"`);
    await queryRunner.query(`DROP INDEX "public"."idx_pix_key"`);
    await queryRunner.query(`DROP INDEX "public"."idx_pix_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_payment_methods_platform_method"`);
    await queryRunner.query(`DROP INDEX "public"."idx_payment_methods_method"`);
    await queryRunner.query(`DROP TABLE "payment_methods"`);
    await queryRunner.query(`DROP TYPE "public"."payment_methods_platform_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_proof_of_payments_tx_created_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_proof_of_payments_transaction_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_proof_of_payments_created_at"`);
    await queryRunner.query(`DROP TABLE "proof_of_payments"`);
    await queryRunner.query(`DROP TABLE "discount_codes"`);
    await queryRunner.query(`DROP TABLE "otp_codes"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "user_verification"`);
    await queryRunner.query(`DROP TYPE "public"."user_verification_verification_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_verification_attempts"`);
    await queryRunner.query(`DROP TABLE "user_bans"`);
    await queryRunner.query(`DROP TABLE "user_contacts"`);
    await queryRunner.query(`DROP TABLE "user_locations"`);
    await queryRunner.query(`DROP TABLE "user_alternative_emails"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TYPE "public"."user_profiles_gender_enum"`);
    await queryRunner.query(`DROP TABLE "user_categories"`);
    await queryRunner.query(`DROP TABLE "user_socials"`);
  }
}
