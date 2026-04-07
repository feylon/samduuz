import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Page } from '../../pages/entities/page.entity';
import { User } from '../../users/entities/user.entity';

@Entity('menus')
export class Menu extends BaseEntity {
  @ApiProperty({ example: 'Universitet' })
  @Column({ length: 150 })
  nameUz: string;

  @ApiProperty({ example: 'Университет' })
  @Column({ length: 150, default: '' })
  nameKr: string;

  @ApiProperty({ example: 'Университет' })
  @Column({ length: 150, default: '' })
  nameRu: string;

  @ApiProperty({ example: 'University' })
  @Column({ length: 150, default: '' })
  nameEn: string;

  @ApiProperty({ example: 1 })
  @Column({ default: 1 })
  priority: number;

  @ManyToOne(() => Menu, (menu) => menu.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  parent: Menu | null;

  @ApiProperty({ example: null, nullable: true, type: Number })
  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  @ApiProperty({ type: () => [Menu] })
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @ApiProperty({ type: () => Page, nullable: true })
  @ManyToOne(() => Page, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  relatedPage: Page | null;

  @ApiProperty({ example: 3, nullable: true, type: Number })
  @Column({ type: 'int', nullable: true })
  relatedPageId: number | null;

  @ApiProperty({ example: null, nullable: true, type: String })
  @Column({ type: 'varchar', length: 500, nullable: true })
  externalLink: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  owner: User | null;

  @ApiProperty({ example: 1, nullable: true, type: Number })
  @Column({ type: 'int', nullable: true })
  ownerId: number | null;
}
