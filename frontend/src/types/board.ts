import { User } from "./user";

export interface Board {
  _id: string;
  name: string;
  privacy: "PUBLIC" | "PRIVATE";
  members: (string | User)[];
  createdAt: string;
  updatedAt: string;
}