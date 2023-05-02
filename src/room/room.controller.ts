import { RoomService } from './room.service';
import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get(':roomName')
  findRoom(@Param('roomName') roomName: string) {
    return this.roomService.findRoom(roomName);
  }
}
