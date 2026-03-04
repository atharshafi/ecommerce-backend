import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum AddressType {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING'
}

export class AddressDto {
  @IsString()
  street!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  postalCode!: string;

  @IsOptional()
  @IsString()
  country?: string = 'INDIA';

  @IsEnum(AddressType)
  type!: AddressType;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;
}