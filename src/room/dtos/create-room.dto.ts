import { RoomStatusType } from 'src/common/types';
import { AttendersDto } from './attenders.dto';

export type CreateRoomDto = {
  roomName: string;
  attenders: AttendersDto[];
  roomStatus: RoomStatusType;
};
