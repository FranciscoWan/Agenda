import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/evento.entity';
import { EventsService } from './eventos.service';
import { EventsController } from './eventos.controller';
import { IsAfterConstraint } from './validators/is-after.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService, IsAfterConstraint],
  controllers: [EventsController],
})
export class EventsModule {}
