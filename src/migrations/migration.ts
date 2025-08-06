import { MigrationInterface, QueryRunner } from 'typeorm';

        export class MigrationName implements MigrationInterface {
            public async up(queryRunner: QueryRunner): Promise<void> {
                // Implement migration logic here
            }

            public async down(queryRunner: QueryRunner): Promise<void> {
                // Implement rollback logic here
            }
        }