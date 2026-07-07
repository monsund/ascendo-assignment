import api from "./api";
import { Card } from "@/types/card";

export const getCards = async () => {
  const response = await api.get("/cards");
  return response.data.data;
};

export const getCardsByBoard = async (boardId: string) => {
  const response = await api.get("/cards");
  const allCards: Card[] = response.data.data;
  return allCards.filter((card) => {
    const id = typeof card.boardId === "string" ? card.boardId : card.boardId._id;
    return id === boardId;
  });
};

export const createCard = async (
  boardId: string,
  listId: string,
  name: string,
  description: string
) => {
  const response = await api.post("/cards", {
    boardId,
    listId,
    name,
    description,
  });
  return response.data.data;
};

export const updateCard = async (
  cardId: string,
  name: string,
  description: string
) => {
  const response = await api.put(`/cards/${cardId}`, {
    name,
    description,
  });
  return response.data.data;
};

export const deleteCard = async (cardId: string) => {
  const response = await api.delete(`/cards/${cardId}`);
  return response.data.data;
};

export const assignUser = async (cardId: string, userId: string | null) => {
  const response = await api.put(`/cards/${cardId}/assign`, {
    assignedUserId: userId,
  });
  return response.data.data;
};

export const moveCard = async (cardId: string, listId: string) => {
  const response = await api.patch(`/cards/${cardId}/move`, {
    listId,
  });
  return response.data.data;
};
