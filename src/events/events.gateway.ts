import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('init');
  }

  handleConnection(client: Socket) {
    console.log(`lient connecter ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`lient disconnected ${client.id}`);
  }

  @SubscribeMessage('room')
  async room(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    console.log('connected:', client);
    return data;
  }
}
