import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoomStatusType } from 'src/common/types';
import { AttendersDto } from 'src/room/dtos/attenders.dto';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop()
  roomName: string;

  @Prop()
  attenders: AttendersDto[];

  @Prop()
  roomStatus: RoomStatusType;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
