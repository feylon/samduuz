import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('useful_links')
export class UsefulLink extends BaseEntity {
  @ApiProperty({ example: 'Yagona interaktiv davlat xizmatlari portali' })
  @Column({ length: 255 })
  nameUz: string;

  @ApiProperty({ example: 'Ягона интерактив давлат хизматлари портали' })
  @Column({ length: 255, default: '' })
  nameKr: string;

  @ApiProperty({ example: 'Единый портал интерактивных государственных услуг' })
  @Column({ length: 255, default: '' })
  nameRu: string;

  @ApiProperty({ example: 'Single portal of interactive public services' })
  @Column({ length: 255, default: '' })
  nameEn: string;

  @ApiProperty({ example: 'https://my.gov.uz' })
  @Column({ length: 500 })
  externalLink: string;

  @ApiProperty({ example: 'links/mygov.png' })
  @Column({ length: 500 })
  imagePath: string;

  @ApiProperty({ example: 1 })
  @Column({ default: 1 })
  priority: number;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  owner: User | null;

  @ApiProperty({ example: 1, nullable: true, type: Number })
  @Column({ type: 'int', nullable: true })
  ownerId: number | null;
}
