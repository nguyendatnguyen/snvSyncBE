import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnShopNameIntoHistoryTable1653364276693 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\`  ADD COLUMN \`shopName\` varchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\`  DROP COLUMN \`shopName\` `);
    }

}
