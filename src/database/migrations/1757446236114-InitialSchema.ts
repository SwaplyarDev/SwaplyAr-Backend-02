import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1757446236114 implements MigrationInterface {
  name = 'InitialSchema1757446236114';

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
      `CREATE TABLE "user_locations" ("user_location_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "department" character varying NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "user_id" uuid, CONSTRAINT "PK_25f91e939378eb6028868baf0ae" PRIMARY KEY ("user_location_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_contacts" ("user_contact_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_9636da2a0471db068889ad23940" PRIMARY KEY ("user_contact_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_questions" ("user_question_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_20f9b11d3e3916300715c2dc18f" PRIMARY KEY ("user_question_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_rewards_ledger" ("ledger_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric NOT NULL DEFAULT '0', "stars" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_96bbda5ec76e8ff391a2bb3497" UNIQUE ("user_id"), CONSTRAINT "PK_c5c7b28c2ee4d8c0285cb65cd3d" PRIMARY KEY ("ledger_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_bans" ("user_ban_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" character varying NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "is_permanent" boolean NOT NULL, "is_active" boolean NOT NULL, "user_id" uuid, CONSTRAINT "PK_c303745e5445d520c2b2fcd5efd" PRIMARY KEY ("user_ban_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discount_codes" ("discount_code_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "value" integer NOT NULL, "currency_code" character varying NOT NULL, "valid_from" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b967edd0d46547d4a92b4a1c6b3" UNIQUE ("code"), CONSTRAINT "PK_fadc09294961ba8a3f08205fe28" PRIMARY KEY ("discount_code_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "proof_of_payments" ("payments_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "img_url" character varying NOT NULL, "create_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_e60826939afe2b6d24ed4bf3fcc" PRIMARY KEY ("payments_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_methods_platform_enum" AS ENUM('bank', 'pix', 'virtual_bank', 'receiver_crypto')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_methods" ("payment_method_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "platform" "public"."payment_methods_platform_enum" NOT NULL, "method" character varying NOT NULL, "currency" character varying, "email_account" character varying, "transfer_code" character varying, "virtual_bank_id" character varying, "pix_key" character varying, "pix_value" character varying, "cpf" character varying, "network" character varying, "wallet" character varying, "bank_name" character varying, "send_method_key" character varying, "send_method_value" character varying, "document_type" character varying, "document_value" character varying, CONSTRAINT "PK_397415468d59f5743a83c6c7bef" PRIMARY KEY ("payment_method_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fe346b48f443c7c15693b5f8cd" ON "payment_methods" ("platform", "method") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_02d578d93253ca308ec3110982" ON "payment_methods" ("method") `,
    );
    await queryRunner.query(
      `CREATE TABLE "financial_accounts" ("financial_account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "created_by" character varying, "phone_number" character varying, "type" character varying NOT NULL, "payment_method_id" uuid NOT NULL, CONSTRAINT "REL_ef910094abc02f4861e35c4011" UNIQUE ("payment_method_id"), CONSTRAINT "PK_052999803d2720c5c5c98f6b8c2" PRIMARY KEY ("financial_account_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef910094abc02f4861e35c4011" ON "financial_accounts" ("payment_method_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ecdcf15bb302e00c5b8590802" ON "financial_accounts" ("type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "amount" ("amount_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amountSent" numeric(15,2) NOT NULL, "currencySent" character varying NOT NULL, "amountReceived" numeric(15,2) NOT NULL, "currencyReceived" character varying NOT NULL, "received" boolean NOT NULL, CONSTRAINT "PK_fb1f9159cc149775fc9e9be9c75" PRIMARY KEY ("amount_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("note_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "img_url" character varying, "message" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" character varying(10), CONSTRAINT "REL_1cd1479d6f04cc72659f5921e6" UNIQUE ("transaction_id"), CONSTRAINT "PK_77f245eb03df887f6f03c57f7f5" PRIMARY KEY ("note_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "regrets" ("regret_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_id" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "description" character varying NOT NULL, "payment_info_id" uuid, CONSTRAINT "REL_a877ca7e6cddbe5ae8cf98450a" UNIQUE ("transaction_id"), CONSTRAINT "REL_8dd9ff9e0708f17eb60d0fe874" UNIQUE ("payment_info_id"), CONSTRAINT "PK_147d7c8a8e3f8742fa022faf667" PRIMARY KEY ("regret_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_final_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'canceled', 'modified', 'refunded', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("transaction_id" character varying(10) NOT NULL, "country_transaction" character varying NOT NULL, "message" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "final_status" "public"."transactions_final_status_enum" NOT NULL DEFAULT 'pending', "isNoteVerified" boolean NOT NULL DEFAULT false, "noteVerificationExpiresAt" TIMESTAMP, "sender_account_id" uuid, "receiver_account_id" uuid, "note_id" uuid, "regret_id" uuid, "payments_id" uuid, "amount_id" uuid, CONSTRAINT "REL_c3f53f3fa7100cb3fbd2c09c6e" UNIQUE ("note_id"), CONSTRAINT "REL_e006fc4547b2051900939febb6" UNIQUE ("regret_id"), CONSTRAINT "REL_cdee4818a64ef6555829c23f51" UNIQUE ("payments_id"), CONSTRAINT "REL_2ca3a8b59e96c792e4ec3c0dc8" UNIQUE ("amount_id"), CONSTRAINT "PK_9162bf9ab4e31961a8f7932974c" PRIMARY KEY ("transaction_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_discounts" ("user_discount_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "used_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "discount_code_id" uuid, "transaction_id" character varying(10), CONSTRAINT "REL_9ff3f6733494645af3a5bd0cc7" UNIQUE ("transaction_id"), CONSTRAINT "PK_7b3d32ad25d2c778d749f43bf0a" PRIMARY KEY ("user_discount_id"))`,
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
      `CREATE TYPE "public"."users_user_role_enum" AS ENUM('user', 'admin', 'super_admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_role" "public"."users_user_role_enum" NOT NULL DEFAULT 'user', "terms_accepted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "validated_at" TIMESTAMP WITH TIME ZONE, "is_active" boolean NOT NULL DEFAULT true, "is_validated" boolean NOT NULL DEFAULT false, "user_validated" boolean NOT NULL DEFAULT false, "refreshToken" character varying, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_account" ("account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_name" character varying, "account_type" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "first_name" character varying, "last_name" character varying, CONSTRAINT "PK_7db53a014418432811b1eb1aa97" PRIMARY KEY ("account_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_receiver_crypto" ("receiver_crypto" uuid NOT NULL DEFAULT uuid_generate_v4(), "currency" character varying NOT NULL, "network" character varying NOT NULL, "wallet" character varying NOT NULL, "account_id" uuid NOT NULL, CONSTRAINT "PK_ef37c30532688b893115e043094" PRIMARY KEY ("receiver_crypto"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_pix" ("pix_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pix_key" character varying NOT NULL, "pix_value" character varying NOT NULL, "cpf" character(11) NOT NULL, "account_id" uuid NOT NULL, CONSTRAINT "PK_97f3ba4bc946f4b71161027df41" PRIMARY KEY ("pix_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_bank" ("bank_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "currency" character varying NOT NULL, "bank_name" character varying NOT NULL, "send_method_key" character varying NOT NULL, "send_method_value" character varying NOT NULL, "document_type" character varying NOT NULL, "document_value" numeric NOT NULL, "account_id" uuid NOT NULL, CONSTRAINT "PK_a8a036ab54bfc1502b44a40be26" PRIMARY KEY ("bank_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "virtual_bank" ("virtual_bank_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_type" character varying, "currency" character varying NOT NULL, "account_id" uuid NOT NULL, "email" character varying NOT NULL, "type" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "PK_f13a7358e606097334cd0970a32" PRIMARY KEY ("virtual_bank_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "qualifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_id" character varying NOT NULL, "stars_amount" integer NOT NULL, "note" character varying, CONSTRAINT "PK_9ed4d526ac3b76ba3f1c1080433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, "user_id" character varying, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "abandoned_transactions" ("abandoned_transaction_id" character varying(10) NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_596b224b2cdf41add5186844cdf" PRIMARY KEY ("abandoned_transaction_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administracion_master_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'canceled', 'modified', 'refunded', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "administracion_master" ("transaction_id" character varying NOT NULL, "admin_user_id" uuid NOT NULL, "status" "public"."administracion_master_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "begin_transaction" TIMESTAMP, "end_transaction" TIMESTAMP, "transfer_received" text, CONSTRAINT "PK_07c46f45239be5da141ac02a58f" PRIMARY KEY ("transaction_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."administracion_status_log_status_enum" AS ENUM('pending', 'review_payment', 'approved', 'rejected', 'refund_in_transit', 'in_transit', 'discrepancy', 'canceled', 'modified', 'refunded', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "administracion_status_log" ("log_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."administracion_status_log_status_enum" NOT NULL, "changed_at" TIMESTAMP NOT NULL DEFAULT now(), "message" text, "changed_by_admin_id" uuid NOT NULL, "additionalData" jsonb, "transaction_id" character varying, CONSTRAINT "PK_93c3d98ede4fd3ac21a4f9d021f" PRIMARY KEY ("log_id"))`,
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
      `ALTER TABLE "user_questions" ADD CONSTRAINT "FK_7df0da6b1f94c132a9fbed5155c" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_rewards_ledger" ADD CONSTRAINT "FK_96bbda5ec76e8ff391a2bb34972" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bans" ADD CONSTRAINT "FK_a142c9954b2fd911b3e7ea8c307" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "financial_accounts" ADD CONSTRAINT "FK_ef910094abc02f4861e35c4011f" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("payment_method_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_1cd1479d6f04cc72659f5921e6f" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regrets" ADD CONSTRAINT "FK_a877ca7e6cddbe5ae8cf98450ad" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "regrets" ADD CONSTRAINT "FK_8dd9ff9e0708f17eb60d0fe8742" FOREIGN KEY ("payment_info_id") REFERENCES "proof_of_payments"("payments_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_ab04d6f62bdfac21c1e3c04a33d" FOREIGN KEY ("sender_account_id") REFERENCES "financial_accounts"("financial_account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_55c3596e9965fdbbf0da0ff8c29" FOREIGN KEY ("receiver_account_id") REFERENCES "financial_accounts"("financial_account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_c3f53f3fa7100cb3fbd2c09c6e6" FOREIGN KEY ("note_id") REFERENCES "notes"("note_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e006fc4547b2051900939febb6c" FOREIGN KEY ("regret_id") REFERENCES "regrets"("regret_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_cdee4818a64ef6555829c23f519" FOREIGN KEY ("payments_id") REFERENCES "proof_of_payments"("payments_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "user_discounts" ADD CONSTRAINT "FK_9ff3f6733494645af3a5bd0cc7d" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
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
      `ALTER TABLE "user_receiver_crypto" ADD CONSTRAINT "FK_cd48d2f20a28fe96db41026eeb6" FOREIGN KEY ("account_id") REFERENCES "user_account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_pix" ADD CONSTRAINT "FK_a542a3ac1446cbf2e693a1421a0" FOREIGN KEY ("account_id") REFERENCES "user_account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bank" ADD CONSTRAINT "FK_080d426b06188408bc1cc508c84" FOREIGN KEY ("account_id") REFERENCES "user_account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "virtual_bank" ADD CONSTRAINT "FK_80c98daa72c7a7331174b51460d" FOREIGN KEY ("account_id") REFERENCES "user_account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "virtual_bank" DROP CONSTRAINT "FK_80c98daa72c7a7331174b51460d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bank" DROP CONSTRAINT "FK_080d426b06188408bc1cc508c84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_pix" DROP CONSTRAINT "FK_a542a3ac1446cbf2e693a1421a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_receiver_crypto" DROP CONSTRAINT "FK_cd48d2f20a28fe96db41026eeb6"`,
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
      `ALTER TABLE "user_discounts" DROP CONSTRAINT "FK_9ff3f6733494645af3a5bd0cc7d"`,
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
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_cdee4818a64ef6555829c23f519"`,
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
      `ALTER TABLE "user_bans" DROP CONSTRAINT "FK_a142c9954b2fd911b3e7ea8c307"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_rewards_ledger" DROP CONSTRAINT "FK_96bbda5ec76e8ff391a2bb34972"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_questions" DROP CONSTRAINT "FK_7df0da6b1f94c132a9fbed5155c"`,
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
    await queryRunner.query(`DROP TABLE "administracion_status_log"`);
    await queryRunner.query(`DROP TYPE "public"."administracion_status_log_status_enum"`);
    await queryRunner.query(`DROP TABLE "administracion_master"`);
    await queryRunner.query(`DROP TYPE "public"."administracion_master_status_enum"`);
    await queryRunner.query(`DROP TABLE "abandoned_transactions"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "qualifications"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "virtual_bank"`);
    await queryRunner.query(`DROP TABLE "user_bank"`);
    await queryRunner.query(`DROP TABLE "user_pix"`);
    await queryRunner.query(`DROP TABLE "user_receiver_crypto"`);
    await queryRunner.query(`DROP TABLE "user_account"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_user_role_enum"`);
    await queryRunner.query(`DROP TABLE "otp_codes"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "user_verification"`);
    await queryRunner.query(`DROP TYPE "public"."user_verification_verification_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_verification_attempts"`);
    await queryRunner.query(`DROP TABLE "user_discounts"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_final_status_enum"`);
    await queryRunner.query(`DROP TABLE "regrets"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "amount"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0ecdcf15bb302e00c5b8590802"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ef910094abc02f4861e35c4011"`);
    await queryRunner.query(`DROP TABLE "financial_accounts"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_02d578d93253ca308ec3110982"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fe346b48f443c7c15693b5f8cd"`);
    await queryRunner.query(`DROP TABLE "payment_methods"`);
    await queryRunner.query(`DROP TYPE "public"."payment_methods_platform_enum"`);
    await queryRunner.query(`DROP TABLE "proof_of_payments"`);
    await queryRunner.query(`DROP TABLE "discount_codes"`);
    await queryRunner.query(`DROP TABLE "user_bans"`);
    await queryRunner.query(`DROP TABLE "user_rewards_ledger"`);
    await queryRunner.query(`DROP TABLE "user_questions"`);
    await queryRunner.query(`DROP TABLE "user_contacts"`);
    await queryRunner.query(`DROP TABLE "user_locations"`);
    await queryRunner.query(`DROP TABLE "user_alternative_emails"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TYPE "public"."user_profiles_gender_enum"`);
    await queryRunner.query(`DROP TABLE "user_categories"`);
    await queryRunner.query(`DROP TABLE "user_socials"`);
  }
}
