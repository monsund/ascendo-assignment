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
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new Error("Invalid board id.");
  }

  if (!mongoose.Types.ObjectId.isValid(listId)) {
    throw new Error("Invalid list id.");
  }

  if (
    assignedUserId &&
    !mongoose.Types.ObjectId.isValid(assignedUserId)
  ) {
    throw new Error("Invalid assigned user id.");
  }

  const board = await Board.findById(boardId);

  if (!board) {
    throw new Error("Board not found.");
  }

  const list = await List.findById(listId);

  if (!list) {
    throw new Error("List not found.");
  }

  if (list.boardId.toString() !== boardId) {
    throw new Error("List does not belong to the board.");
  }

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

  const lastCard = await Card.findOne({
    listId,
  }).sort({
    position: -1,
  });

  const position = lastCard ? lastCard.position + 1 : 1;

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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid card id.");
  }

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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid card id.");
  }

  const card = await Card.findById(id);

  if (!card) {
    throw new Error("Card not found.");
  }

  card.name = data.name;
  card.description = data.description;

  await card.save();

  return card;
};

export const deleteCard = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid card id.");
  }

  const card = await Card.findById(id);

  if (!card) {
    throw new Error("Card not found.");
  }

  await card.deleteOne();

  return card;
};

export const assignUserToCard = async (
  cardId: string,
  userId: string | null
) => {
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new Error("Invalid card id.");
  }

  const card = await Card.findById(cardId);

  if (!card) {
    throw new Error("Card not found.");
  }

  if (userId === null) {
    card.assignedUserId = null;

    await card.save();

    return card;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const board = await Board.findById(card.boardId);

  if (!board) {
    throw new Error("Board not found.");
  }

  const isMember = board.members.some(
    (member) => member.toString() === userId
  );

  if (!isMember) {
    throw new Error("User is not a member of this board.");
  }

  card.assignedUserId = new mongoose.Types.ObjectId(userId);

  await card.save();

  return await card.populate("assignedUserId", "name email");
};

export const moveCard = async (
  cardId: string,
  destinationListId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new Error("Invalid card id.");
  }

  const card = await Card.findById(cardId);

  if (!card) {
    throw new Error("Card not found.");
  }

  if (!mongoose.Types.ObjectId.isValid(destinationListId)) {
    throw new Error("Invalid list id.");
  }

  const destinationList = await List.findById(destinationListId);

  if (!destinationList) {
    throw new Error("List not found.");
  }

  const currentList = await List.findById(card.listId);

  if (!currentList) {
    throw new Error("Current list not found.");
  }

  if (destinationList._id.toString() === currentList._id.toString()) {
    throw new Error("Card is already in this list.");
  }

  if (destinationList.boardId.toString() !== currentList.boardId.toString()) {
    throw new Error(
      "Cards can only be moved within the same board."
    );
  }

  card.listId = new mongoose.Types.ObjectId(destinationListId);

  await card.save();

  return card;
};

export interface ReorderCardInput {
  id: string;
  position: number;
}

export const reorderCards = async (
  listId: string,
  cardsToReorder: ReorderCardInput[]
) => {
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    throw new Error("Invalid list id.");
  }

  const list = await List.findById(listId);

  if (!list) {
    throw new Error("List not found.");
  }

  const operations = [];

  const cardIds: mongoose.Types.ObjectId[] = [];
  for (const cardData of cardsToReorder) {
    if (!mongoose.Types.ObjectId.isValid(cardData.id)) {
      throw new Error(`Invalid card id: ${cardData.id}`);
    }
    cardIds.push(new mongoose.Types.ObjectId(cardData.id));
  }

  const existingCards = await Card.find({
    _id: { $in: cardIds },
  });

  const cardMap = new Map(
    existingCards.map((card) => [card._id.toString(), card])
  );

  for (const cardData of cardsToReorder) {
    const card = cardMap.get(cardData.id);

    if (!card) {
      throw new Error(`Card not found: ${cardData.id}`);
    }

    if (card.listId.toString() !== listId) {
      throw new Error(
        `Card ${cardData.id} does not belong to list ${listId}.`
      );
    }

    operations.push({
      updateOne: {
        filter: { _id: card._id },
        update: { $set: { position: cardData.position } },
      },
    });
  }

  if (operations.length > 0) {
    await Card.bulkWrite(operations);
  }

  const updatedCards = await Card.find({ listId })
    .populate("boardId", "name privacy")
    .populate("listId", "title position")
    .populate("assignedUserId", "name email")
    .sort({ position: 1 });

  return updatedCards;
};

