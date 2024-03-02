export type DefaultValues = {
  startYear: number;
  endYear: number;
  minRating: number;
  maxRating: number,
  genre: number[];
}

export interface SessionData {
  id: number;
  startYear: number;
  endYear: number;
  minRating: number;
  maxRating: number;
  genre: number[];
  createdAt: Date;
}

export type MainMessage = {
  messageId: number;
  chatId: number;
}