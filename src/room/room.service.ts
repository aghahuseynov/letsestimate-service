import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/schemas/room.schema';
import { CreateRoomDto } from './dtos/create-room.dto';
import { AttendersDto } from './dtos/attenders.dto';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async createRoom(roomName: string, playerName: string, socketId: string) {
    const room: CreateRoomDto = {
      roomName: roomName,
      attenders: [
        {
          playerName: playerName,
          socketId: socketId,
          isAdmin: true,
        },
      ],
      roomStatus: false,
    };

    const roomCollection = new this.roomModel(room);
    await roomCollection.save();

    return await this.roomModel.find({ roomName: roomName });
  }

  async joinRoom(
    roomName: string,
    playerName: string,
    socketId: string,
    isAdmin: boolean,
  ) {
    if (!playerName) {
      return;
    }

    const newAttender: AttendersDto = {
      playerName: playerName,
      socketId: socketId,
      isAdmin: isAdmin,
    };

    const currentModel = (
      await this.roomModel.findOne({ roomName: roomName })
    )?.toJSON();

    const findAttender = currentModel.attenders.find(
      (q) => q.playerName === playerName || q.socketId === socketId,
    );

    if (findAttender) {
      return currentModel;
    }

    currentModel.attenders.push(newAttender);

    return this.roomModel
      .findOneAndUpdate({ roomName: roomName }, currentModel)
      .exec();
  }

  async findRoom(roomName: string) {
    return (await this.roomModel.findOne({ roomName: roomName })).toJSON();
  }

  async changeRoomStatus(roomName: string) {
    const currentModel = (
      await this.roomModel.findOne({ roomName: roomName })
    )?.toJSON();

    currentModel.roomStatus = !currentModel.roomStatus;

    await this.roomModel
      .findOneAndUpdate({ roomName: roomName }, currentModel)
      .exec();

    return await this.findRoom(roomName);
  }

  async removeAttenders(socketId: string) {
    const currentModel = await this.roomModel.find({});

    const currentRoom = await currentModel.find((item) => {
      if (item.attenders.find((q) => q.socketId === socketId)) {
        return item;
      }
    });

    const newAttenders = currentRoom?.attenders.filter(
      (q) => q.socketId !== socketId,
    );

    if (!newAttenders || !currentRoom) {
      return;
    }

    currentRoom.attenders = newAttenders;

    await this.roomModel.findOneAndUpdate(
      { roomName: currentRoom.roomName },
      currentRoom,
    );

    return await this.findRoom(currentRoom.roomName);
  }
}
