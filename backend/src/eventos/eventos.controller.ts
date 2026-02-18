import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './eventos.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from './dto/create-evento.dto';


@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  async create(
    @Body() body: CreateEventDto,
    @Request() req,
  ) {
    return this.eventsService.create(body, req.user.userId);
  }
  @Get()
  async findAll(@Request() req) {
    return this.eventsService.findAll(req.user.userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.eventsService.delete(id, req.user.userId);
  }
}
