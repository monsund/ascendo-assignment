import mongoose from "mongoose";
import Board from "../models/Board";
import User from "../models/User";
import Card from "../models/Card";
import List from "../models/List";

interface CreateBoardInput {
  name: string;
  privacy: "PUBLIC" | "PRIVATE";
  members?: string[];
}

export interface UpdateBoardInput {
  name: string;
  privacy: "PUBLIC" | "PRIVATE";
  members: string[];
}

export const createBoard = async ({
  name,
  privacy,
  members,
}: CreateBoardInput) => {
  const invalidMember = members?.find((id) => !mongoose.Types.ObjectId.isValid(id)
  );
  if (invalidMember) {
    throw new Error("Invalid member id.");
  }

  const users = await User.find({
    _id: { $in: members ?? [] },
  });

  if (users.length !== (members ?? []).length) {
    throw new Error("One or more members do not exist.");
  }

  const board = await Board.create({
    name,
    privacy,
    members: members ?? [],
  });

  return board.populate("members");
};

export const getBoards = async () => {
  return Board.find().sort({ createdAt: -1 }).populate("members");
};

export const getBoardById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid board id.");
  }

  return Board.findById(id).populate("members");
};

export const updateBoard = async (
  id: string,
  data: UpdateBoardInput
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid board id.");
  }

  const board = await Board.findById(id);

  if (!board) {
    throw new Error("Board not found.");
  }


  const users = await User.find({
    _id: { $in: data.members },
  });

  if (users.length !== data.members.length) {
    throw new Error("One or more members do not exist.");
  }

  board.name = data.name;
  board.privacy = data.privacy;
  board.members = data.members.map(memberId => new mongoose.Types.ObjectId(memberId));

  await board.save();

  return board.populate("members");
};

export const deleteBoard = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid board id.");
  }

  const board = await Board.findById(id);

  if (!board) {
    throw new Error("Board not found.");
  }

  await Card.deleteMany({
    boardId: id,
  });

  await List.deleteMany({
    boardId: id,
  });

  await board.deleteOne();

  return board;
};
