import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  readonly message: string;

  @IsString()
  readonly handle: string;
}
