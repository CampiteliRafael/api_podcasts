# Migration Documentation

## Overview
This document provides an overview of the migration system used in the project, detailing the purpose and functionality of the `up` and `down` methods, as well as examples of usage for specific migrations.

## Migration Functions

### up
The `up` method is responsible for applying changes to the database schema. This method is executed when the migration is run. It typically includes commands to create tables, add columns, or modify existing structures.

### down
The `down` method is responsible for reverting the changes made by the `up` method. This method is executed when the migration is rolled back. It should include commands to drop tables, remove columns, or revert modifications.

## Example Migration: AddSubscriptionStatusToUsers

### File: `202405201230-add-subscription-status.ts`

```typescript
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
```

### Usage
To apply this migration, run the following command:
```bash
npm run typeorm migration:run
```

To revert this migration, run:
```bash
npm run typeorm migration:revert
```

## Schema Versioning
Schema versioning is managed through the migration files. Each migration file should be named with a timestamp followed by a descriptive name, ensuring that migrations are applied in the correct order. This allows for easy tracking of changes and facilitates collaboration among developers.

## Conclusion
The migration system provides a structured approach to managing database schema changes, ensuring that all modifications are versioned and can be easily applied or reverted as needed.