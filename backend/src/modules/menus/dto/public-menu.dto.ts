import { ApiProperty } from '@nestjs/swagger';

export class PublicMenuDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Universitet' })
  name: string;

  @ApiProperty({ example: 1 })
  priority: number;

  @ApiProperty({ example: '/pages/universitet-tarixi', nullable: true, type: String })
  link: string | null;

  @ApiProperty({ example: false })
  isExternal: boolean;

  @ApiProperty({ type: () => [PublicMenuDto] })
  children: PublicMenuDto[];
}
