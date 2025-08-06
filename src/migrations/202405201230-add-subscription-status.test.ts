import { QueryRunner } from "typeorm";
import { AddSubscriptionStatusToUsers202405201230 } from "./202405201230-add-subscription-status";

describe("AddSubscriptionStatusToUsers202405201230 Migration", () => {
    let queryRunner: QueryRunner;
    let migration: AddSubscriptionStatusToUsers202405201230;

    beforeEach(() => {
        queryRunner = {
            query: jest.fn()
        } as unknown as QueryRunner;
        migration = new AddSubscriptionStatusToUsers202405201230();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("up()", () => {
        it("should create subscription status and add column to users table", async () => {
            await migration.up(queryRunner);

            expect(queryRunner.query).toHaveBeenNthCalledWith(1,
                `CREATE TYPE "user_subscription_status_enum" AS ENUM ('active', 'canceled', 'pending')`
            );
            
            expect(queryRunner.query).toHaveBeenNthCalledWith(2,
                `ALTER TABLE "users" ADD COLUMN "subscription_status" "user_subscription_status_enum" NOT NULL DEFAULT 'active'`
            );
        });
    });

    describe("down()", () => {
        it("should remove subscription_status column and drop enum type", async () => {
            await migration.down(queryRunner);

            expect(queryRunner.query).toHaveBeenNthCalledWith(1,
                `ALTER TABLE "users" DROP COLUMN "subscription_status"`
            );
            
            expect(queryRunner.query).toHaveBeenNthCalledWith(2,
                `DROP TYPE "user_subscription_status_enum"`
            );
        });
    });
}