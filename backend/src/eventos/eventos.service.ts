import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from './entities/evento.entity';
import { CreateEventDto } from './dto/create-evento.dto';
import { UpdateEventDto } from './dto/update-evento.dto';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class EventsService {
  prisma: any;
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

  async findByPeriod(userId: string, query: any) {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    try {
      if (query.view === 'month') {
        const year = Number(query.year);
        const month = Number(query.month);
        startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
      }
      else if (query.view === 'week') {
        const year = Number(query.year);
        const week = Number(query.week);

        const referenceDate = new Date(year, 0, 1);
        const firstDayOfWeek = new Date(referenceDate);
        firstDayOfWeek.setDate(referenceDate.getDate() + (week - 1) * 7);
        const dayOfWeek = firstDayOfWeek.getDay();
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOfWeek);

        startDate = new Date(firstDayOfWeek);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      }
      else if (query.view === 'day') {
        const year = Number(query.year);
        const month = Number(query.month);
        const day = Number(query.day);
        startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
      }
      else {
        throw new Error('Período inválido');
      }

      return this.eventRepository.find({
        where: {
          usuario_id: userId,
          dataInicio: LessThanOrEqual(endDate),
          dataFim: MoreThanOrEqual(startDate),
        },
        order: { dataInicio: 'ASC' }
      });
    } catch (error) {
      console.error('Erro ao acessar o banco:', error);
      throw new InternalServerErrorException(
        'Erro ao buscar eventos no banco de dados'
      );
    }
  }


  async delete(eventId: string, userId: string) {
    return this.eventRepository.delete({
      id: eventId,
      usuario_id: userId, // Segurança
    });
  }
}

