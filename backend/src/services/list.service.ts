import mongoose from "mongoose";
import List from "../models/List";
import Board from "../models/Board";
import Card from "../models/Card";

export interface CreateListInput {
  boardId: string;
  title: string;
}

export interface UpdateListInput {
  title: string;
}

export const createList = async ({
  boardId,
  title,
}: CreateListInput) => {
  // Validate Board ID
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new Error("Invalid board id.");
  }

  // Check if board exists
  const existingBoard = await Board.findById(boardId);

  if (!existingBoard) {
    throw new Error("Board not found.");
  }

  // Check if a list with the same title already exists in this board
  const existingList = await List.findOne({
    boardId,
    title,
  });

  if (existingList) {
    throw new Error("List with this title already exists.");
  }

  // Find the last list position
  const lastList = await List.findOne({ boardId })
    .sort({ position: -1 });

  const position = lastList ? lastList.position + 1 : 1;

  // Create the list
  const list = await List.create({
    boardId,
    title,
    position,
  });

  return list;
};

export const getLists = async () => {
  const lists = await List.find()
    .populate("boardId", "name privacy")
    .sort({ position: 1 });

  return lists;
};

export const getListById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid list id.");
  }

  const list = await List.findById(id).populate(
    "boardId",
    "name privacy"
  );

  if (!list) {
    throw new Error("List not found.");
  }

  return list;
};

export const updateList = async (
  id: string,
  data: UpdateListInput
) => {
  // Validate List ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid list id.");
  }

  // Check if list exists
  const list = await List.findById(id);

  if (!list) {
    throw new Error("List not found.");
  }

  // Prevent duplicate titles within the same board
  const existingList = await List.findOne({
    boardId: list.boardId,
    title: data.title,
    _id: { $ne: id },
  });

  if (existingList) {
    throw new Error("List with this title already exists.");
  }

  // Update title
  list.title = data.title;

  await list.save();

  return list;
};

// export const deleteList = async (id: string) => {
//   // Validate List ID
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new Error("Invalid list id.");
//   }

//   // Check if list exists
//   const list = await List.findById(id);

//   if (!list) {
//     throw new Error("List not found.");
//   }

//   // Delete list
//   await list.deleteOne();

//   return list;
// };

export const deleteList = async (id: string) => {
  // Validate List ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid list id.");
  }

  // Check if list exists
  const list = await List.findById(id);

  if (!list) {
    throw new Error("List not found.");
  }

  // Delete all cards in this list
  await Card.deleteMany({
    listId: id,
  });

  // Delete the list
  await list.deleteOne();

  return list;
};

export const getListsByBoard = async (boardId: string) => {
  // Validate Board ID
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new Error("Invalid board id.");
  }

  // Check if board exists
  const board = await Board.findById(boardId);

  if (!board) {
    throw new Error("Board not found.");
  }

  // Fetch lists
  const lists = await List.find({ boardId }).sort({
    position: 1,
  });

  return lists;
};
