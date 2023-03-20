import { IsString } from 'class-validator';
import { Column, Entity,PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn,UpdateDateColumn } from "typeorm";

@Entity()
export class SubHistory {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  syncId: string;

  @Column()
  @IsString()
  jobId: string;

  @Column()
  @IsString()
  status: number; 

  @Column()
  @IsString()
  name: string; 

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;
  
 
}