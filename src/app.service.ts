import { Injectable } from '@nestjs/common';
import { Room } from './schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  getHello() {
    return this.roomModel.find({}).exec();
  }
}
