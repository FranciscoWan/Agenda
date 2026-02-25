import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/evento.entity';
import { EventsService } from './eventos.service';
import { EventsController } from './eventos.controller';
import { IsAfterConstraint } from './validators/is-after.validator';
import { EventsGateway } from './eventos.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [
    EventsService, 
    IsAfterConstraint,
    EventsService,
    EventsGateway
  ],
  controllers: [EventsController],
})
export class EventsModule {}
