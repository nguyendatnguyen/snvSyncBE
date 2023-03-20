import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameShopNameToSyncIdAtHistoryTabel1652926582995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` RENAME COLUMN \`shopName\` TO \`syncId\`;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` RENAME COLUMN \`syncId\` TO \`shopName\`;`)
    }

}
