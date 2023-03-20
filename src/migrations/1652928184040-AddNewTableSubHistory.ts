import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNewTableSubHistory1652928184040 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sub_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`syncId\` varchar(255) NOT NULL, \`jobId\` varchar(255) NOT NULL, \`status\` INT NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`sub_history\``);
    }

}
