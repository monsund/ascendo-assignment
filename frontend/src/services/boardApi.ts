import api from "./api";

export const getBoards = async () => {
  const response = await api.get("/boards");
  return response.data.data;
};

export const getBoardById = async (id: string) => {
  const response = await api.get(`/boards/${id}`);
  return response.data.data;
};

export const createBoard = async (
  name: string,
  privacy: "PUBLIC" | "PRIVATE",
  members: string[] = []
) => {
  const response = await api.post("/boards", {
    name,
    privacy,
    members,
  });
  return response.data.data;
};

export const updateBoard = async (
  id: string,
  name: string,
  privacy: "PUBLIC" | "PRIVATE",
  members: string[] = []
) => {
  const response = await api.put(`/boards/${id}`, {
    name,
    privacy,
    members,
  });
  return response.data.data;
};

export const deleteBoard = async (id: string) => {
  const response = await api.delete(`/boards/${id}`);
  return response.data;
};
