import {MigrationInterface, QueryRunner} from "typeorm";

export class ReNameTableFromShopXtoShop1652062134451 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shopx\` RENAME TO  \`shop\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\` RENAME TO  \`shopx\``);
    }

}
