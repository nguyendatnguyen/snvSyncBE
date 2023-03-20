import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumTopDescriptionInTableShop1652767733837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`  ADD COLUMN \`topDescription\` varchar(4000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`  DROP COLUMN \`topDescription\` `);
    }

}
