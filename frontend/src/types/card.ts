import { Board } from "./board";
import { List } from "./list";
import { User } from "./user";

export interface Card {
  _id: string;
  boardId: Board | string;
  listId: List | string;
  assignedUserId?: User | null;
  name: string;
  description?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}
