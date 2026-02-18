import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/evento.entity';
import { EventsService } from './eventos.service';
import { EventsController } from './eventos.controller';
import { IsBeforeConstraint } from './validators/is-before.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService, IsBeforeConstraint],
  controllers: [EventsController],
})
export class EventsModule {}
