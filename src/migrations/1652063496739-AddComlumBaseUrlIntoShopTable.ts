import {MigrationInterface, QueryRunner} from "typeorm";

export class AddComlumBaseUrlIntoShopTable1652063496739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`
            ADD COLUMN \`baseUrl\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`
            DROP COLUMN \`baseUrl\``);
    }

}
