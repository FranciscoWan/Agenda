import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/evento.entity';
import { CreateEventDto } from './dto/create-evento.dto';
import { UpdateEventDto } from './dto/update-evento.dto';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) { }

  async create(
    data: CreateEventDto,
    userId: string,
  ): Promise<Event> {
    const event = this.eventRepository.create({
      ...data,
      usuario_id: userId,
    });

    return this.eventRepository.save(event);
  }

async update(
  id: string,
  data: UpdateEventDto,
  userId: string,
): Promise<Event> {
  await this.eventRepository.update(
    { id, usuario_id: userId },
    data,
  );

  const updatedEvent = await this.eventRepository.findOne({
    where: { id, usuario_id: userId },
  });

  if (!updatedEvent) {
    throw new NotFoundException('Evento não encontrado');
  }

  return updatedEvent;
}

  async findAll(userId: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { usuario_id: userId },
      order: { dataInicio: 'ASC' },
    });
  }

  async delete(eventId: string, userId: string) {
    return this.eventRepository.delete({
      id: eventId,
      usuario_id: userId, // Segurança
    });
  }
}
