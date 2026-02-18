import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-evento.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
