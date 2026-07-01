import api from "./api";

export const getListsByBoard = async (boardId: string) => {
  const response = await api.get(`/boards/${boardId}/lists`);
  return response.data.data;
};

export const createList = async (boardId: string, title: string) => {
  const response = await api.post("/lists", {
    boardId,
    title,
  });
  return response.data.data;
};

export const updateList = async (listId: string, title: string) => {
  const response = await api.put(`/lists/${listId}`, {
    title,
  });
  return response.data.data;
};

export const deleteList = async (listId: string) => {
  const response = await api.delete(`/lists/${listId}`);
  return response.data;
};