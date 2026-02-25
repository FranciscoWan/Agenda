import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Sse, 
  MessageEvent
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventsGateway, EventNotification } from './eventos.gateway';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './eventos.service';
import { CreateEventDto } from './dto/create-evento.dto';


@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Sse('stream')
  streamEvents(): Observable<MessageEvent> {
    console.log('✅ Cliente SSE conectado');
    
    return this.eventsGateway.notifications$.pipe(
      map((notification: EventNotification) => ({
        data: notification,
      } as MessageEvent))
    );
  }

  @Post()
  async create(
    @Body() body: CreateEventDto,
    @Request() req,
  ) {
      const event = await this.eventsService.create(body, req.user.userId);
      this.eventsGateway.notifyEventCreated(event.id);
      return event
  }
  
  @Get()
  async findByPeriod(
    @Query() query: any,
    @Request() req
  ) {
    const userId = req.user.userId;

    return this.eventsService.findByPeriod(userId, query);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const result = await this.eventsService.delete(id, req.user.userId);
    this.eventsGateway.notifyEventDeleted(id);
    return result 
  }
}
