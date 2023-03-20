import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameTableFromShopToShopX1651487481825 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\` RENAME TO  \`shopx\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shopx\` RENAME TO  \`shop\``);
    }

}
