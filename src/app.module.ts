import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsGateway } from './events/events.gateway';
import { RoomService } from './room/room.service';
import { RoomController } from './room/room.controller';
import { Room, RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'letsestimate',
    }),
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema, collection: 'room' },
    ]),
  ],
  controllers: [RoomController],
  providers: [EventsGateway, RoomService],
})
export class AppModule {}
