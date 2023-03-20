import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumTagsInTableShop1652770466389 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`  ADD COLUMN \`tags\` varchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`  DROP COLUMN \`tags\` `);
    }

}
