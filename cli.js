import { createConnection } from 'typeorm';
        import { Command } from 'commander';

        const program = new Command();

        program
            .command('migration:run')
            .description('Run migrations')
            .requiredOption('--dataSource <dataSource>', 'Data source for the migration')
            .action(async (options) => {
                if (!options.dataSource) {
                    throw new Error('Missing required argument: dataSource');
                }
                const connection = await createConnection(options.dataSource);
                await connection.runMigrations();
                console.log('Migrations executed successfully');
            });

        program.parse(process.argv);