import { User } from "./user";

export interface Board {
  _id: string;
  name: string;
  privacy: string;
}

export interface List {
  _id: string;
  title: string;
  position: number;
}

export interface Card {
  _id: string;
  boardId: Board | string;
  listId: List | string;
  assignedUserId?: string | null;
  assignedUser?: User | null;
  name: string;
  description?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}
