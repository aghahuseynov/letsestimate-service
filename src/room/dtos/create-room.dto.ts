import { AttendersDto } from './attenders.dto';

export type CreateRoomDto = {
  roomName: string;
  attenders: AttendersDto[];
  roomStatus: boolean;
};
