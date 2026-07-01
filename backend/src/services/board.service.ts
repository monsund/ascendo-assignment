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

 // Validate member IDs   
 const invalidMember = members?.find((id) => !mongoose.Types.ObjectId.isValid(id)
 );
 if (invalidMember) {
   throw new Error("Invalid member id.");
 }

  // Check if all members exist
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

  // Check if board exists
  const board = await Board.findById(id);

  if (!board) {
    throw new Error("Board not found.");
  }

  // Validate Member IDs
  const invalidMember = data.members.find(
    (memberId) => !mongoose.Types.ObjectId.isValid(memberId)
  );

  if (invalidMember) {
    throw new Error("Invalid member id.");
  }

  // Check if all members exist
  const users = await User.find({
    _id: { $in: data.members },
  });

  if (users.length !== data.members.length) {
    throw new Error("One or more members do not exist.");
  }

  // Update board
  board.name = data.name;
  board.privacy = data.privacy;
  board.members = data.members.map(memberId => new mongoose.Types.ObjectId(memberId));

  // Save changes
  await board.save();

  return board.populate("members");
};

export const deleteBoard = async (id: string) => {
  // Validate Board ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid board id.");
  }

  // Find Board
  const board = await Board.findById(id);

  if (!board) {
    throw new Error("Board not found.");
  }

  // Delete all cards belonging to the board
  await Card.deleteMany({
    boardId: id,
  });

  // Delete all lists belonging to the board
  await List.deleteMany({
    boardId: id,
  });

  // Delete Board
  await board.deleteOne();

  return board;
};
