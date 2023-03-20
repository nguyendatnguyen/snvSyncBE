import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnNameIntoSubHistoryTable1654237370935 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sub_history\`  ADD COLUMN \`name\` varchar(255) `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sub_history\`  DROP COLUMN \`name\` `);
    }

}
