import mongoose from "mongoose";
import Card from "../models/Card";
import Board from "../models/Board";
import List from "../models/List";
import User from "../models/User";

export interface CreateCardInput {
  boardId: string;
  listId: string;
  assignedUserId?: string;
  name: string;
  description: string;
}

export const createCard = async ({
  boardId,
  listId,
  assignedUserId,
  name,
  description,
}: CreateCardInput) => {
  // Validate Board ID
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new Error("Invalid board id.");
  }

  // Validate List ID
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    throw new Error("Invalid list id.");
  }

  // Validate Assigned User ID (optional)
  if (
    assignedUserId &&
    !mongoose.Types.ObjectId.isValid(assignedUserId)
  ) {
    throw new Error("Invalid assigned user id.");
  }

  // Check Board exists
  const board = await Board.findById(boardId);

  if (!board) {
    throw new Error("Board not found.");
  }

  // Check List exists
  const list = await List.findById(listId);

  if (!list) {
    throw new Error("List not found.");
  }

  // Ensure List belongs to Board
  if (list.boardId.toString() !== boardId) {
    throw new Error("List does not belong to the board.");
  }

  // Validate assigned user (if provided)
  if (assignedUserId) {
    const user = await User.findById(assignedUserId);

    if (!user) {
      throw new Error("Assigned user not found.");
    }

    const isMember = board.members.some(
      (member) => member.toString() === assignedUserId
    );

    if (!isMember) {
      throw new Error(
        "Assigned user is not a member of this board."
      );
    }
  }

  // Determine next position in this list
  const lastCard = await Card.findOne({
    listId,
  }).sort({
    position: -1,
  });

  const position = lastCard ? lastCard.position + 1 : 1;

  // Create card
  const card = await Card.create({
    boardId,
    listId,
    assignedUserId: assignedUserId || null,
    name,
    description,
    position,
  });

  return card;
};

export const getCards = async () => {
  const cards = await Card.find()
    .populate("boardId", "name privacy")
    .populate("listId", "title position")
    .populate("assignedUserId", "name email")
    .sort({ position: 1 });

  return cards;
};

export const getCardById = async (id: string) => {
  // Validate Card ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid card id.");
  }

  // Find card
  const card = await Card.findById(id)
    .populate("boardId", "name privacy")
    .populate("listId", "title position")
    .populate("assignedUserId", "name email");

  if (!card) {
    throw new Error("Card not found.");
  }

  return card;
};

export interface UpdateCardInput {
  name: string;
  description: string;
}

export const updateCard = async (
  id: string,
  data: UpdateCardInput
) => {
  // Validate Card ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid card id.");
  }

  // Check if card exists
  const card = await Card.findById(id);

  if (!card) {
    throw new Error("Card not found.");
  }

  // Update card
  card.name = data.name;
  card.description = data.description;

  await card.save();

  return card;
};

export const deleteCard = async (id: string) => {
  // Validate Card ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid card id.");
  }

  // Check if card exists
  const card = await Card.findById(id);

  if (!card) {
    throw new Error("Card not found.");
  }

  // Delete card
  await card.deleteOne();

  return card;
};

export const assignUserToCard = async (
  cardId: string,
  userId: string | null
) => {
  // Validate Card ID
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new Error("Invalid card id.");
  }

  // Find Card
  const card = await Card.findById(cardId);

  if (!card) {
    throw new Error("Card not found.");
  }

  // Unassign
  if (userId === null) {
    card.assignedUserId = null;

    await card.save();

    return card;
  }

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  // Find User
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Find Board
  const board = await Board.findById(card.boardId);

  if (!board) {
    throw new Error("Board not found.");
  }

  // Ensure user belongs to board
  const isMember = board.members.some(
    (member) => member.toString() === userId
  );

  if (!isMember) {
    throw new Error("User is not a member of this board.");
  }

  // Assign user
  card.assignedUserId = new mongoose.Types.ObjectId(userId);

  await card.save();

  return await card.populate("assignedUserId", "name email");
};

