export type Attender = {
  socketId?: string;
  playerName: string;
  isAdmin: boolean;
};

export type RoomStatusType = 'start' | 'inprogress' | 'end';

export type RoomType = {
  roomName: string;
  attenders: Attender[];
  roomStatus: RoomStatusType;
};

export type AttenderEstimation = {
  playerName: string;
  selectedEstimationSize: string;
};

export type RoomEstimation = {
  roomName: string;
  attenders: AttenderEstimation[];
};
