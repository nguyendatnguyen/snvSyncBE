import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnStatusIntoShopTable1654221265587 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`  ADD COLUMN \`status\` INT `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`  DROP COLUMN \`status\` `);
    }

}
