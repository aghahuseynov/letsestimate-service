import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomEstimation } from 'src/common/types';
import { RoomService } from 'src/room/room.service';

// TODO: looks ugly maybe we can move this to mongo
let roomEstimations: RoomEstimation[] = [];

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class EventsGateway {
  constructor(private roomService: RoomService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`client connecter ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`client disconnected ${client.id}`);
    const roomInfo = await this.roomService.removeAttenders(client.id);

    if (roomInfo) {
      client.leave(roomInfo.roomName);
      client.to(roomInfo.roomName).emit('newAttenders', roomInfo);
    }
  }

  @SubscribeMessage('sendSelectedSize')
  async selectedSize(
    client: Socket,
    room: {
      roomName: string;
      playerName: string;
      selectedEstimationSize: string;
    },
  ) {
    const { roomName, playerName, selectedEstimationSize } = room;

    //TODO: needs improvement
    const currentRoomInfo = roomEstimations.find(
      (q) => q.roomName === roomName,
    );

    if (currentRoomInfo) {
      const attenderEstimation = currentRoomInfo.attenders.find(
        (p) => p.playerName === playerName,
      );

      if (attenderEstimation) {
        attenderEstimation.selectedEstimationSize = selectedEstimationSize;
      } else {
        currentRoomInfo.attenders.push({
          playerName,
          selectedEstimationSize,
        });
      }
    } else {
      roomEstimations.push({
        roomName,
        attenders: [{ playerName, selectedEstimationSize }],
      });
    }
  }

  @SubscribeMessage('showSize')
  async showSize(
    client: Socket,
    roomInfo: { roomName: string; resetEstimation: boolean },
  ) {
    const { roomName } = roomInfo;

    client.to(roomName).emit(
      'showSize',
      roomEstimations.find((q) => q.roomName === roomName),
    );

    return roomEstimations.find((q) => q.roomName === roomName);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    client: Socket,
    room: { roomName: string; playerName: string; isAdmin: boolean },
  ) {
    const { roomName, playerName, isAdmin } = room;

    client.join(roomName);

    await this.roomService.joinRoom(roomName, playerName, client.id, isAdmin);

    const users = await this.roomService.findRoom(roomName);

    client.to(roomName).emit('newAttenders', users);
  }

  @SubscribeMessage('createRoom')
  createRoom(
    client: Socket,
    roomInit: { roomName: string; playerName: string },
  ) {
    const { roomName, playerName } = roomInit;

    this.roomService.createRoom(roomName, playerName, client.id);
  }

  @SubscribeMessage('changeRoomStatus')
  async changeRoomStatus(client: Socket, roomInfo: { roomName: string }) {
    const { roomName } = roomInfo;

    const room = await this.roomService.changeRoomStatus(roomName);

    if (!room.roomStatus) {
      roomEstimations = roomEstimations.filter((q) => q.roomName != roomName);
    }

    client.to(roomName).emit('changeRoomStatus', room);
    client.to(roomName).emit(
      'showSize',
      roomEstimations.find((q) => q.roomName === roomName),
    );

    return {
      room: room,
      roomEstimations: roomEstimations.find((q) => q.roomName === roomName),
    };
  }
}
