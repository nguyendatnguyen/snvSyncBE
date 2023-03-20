import { IsString } from 'class-validator';
import { Column, Entity,PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn,UpdateDateColumn } from "typeorm";

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  accessToken: string;

  @Column()
  @IsString()
  logo: string;

  @Column()
  @IsString()
  baseUrl: string;

  @Column()
  @IsString()
  topDescription: string;  

  @Column()
  @IsString()
  description: string;  

  @Column()
  @IsString()
  tags: string;  

  @Column()
  @IsString()
  status: number;  


  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;
  
//   @ManyToMany(() => Product)
//   @JoinTable()
//   shops: Product[];  
 
}