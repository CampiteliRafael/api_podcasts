import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscriptionStatusToUsers202405201230 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "user_subscription_status_enum" AS ENUM ('active', 'canceled', 'pending')
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "subscription_status" "user_subscription_status_enum" NOT NULL DEFAULT 'active'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "subscription_status"
        `);
        await queryRunner.query(`
            DROP TYPE "user_subscription_status_enum"
        `);
    }
}