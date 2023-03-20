import {MigrationInterface, QueryRunner} from "typeorm";

export class ModifiedShopColumnDesCriptionDataType1652758710044 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`  MODIFY COLUMN \`description\` varchar(10000) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\`  MODIFY COLUMN \`description\` varchar(255) NOT NULL`);
    }

}
