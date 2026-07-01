import api from "./api";
import { User } from "@/types/user";

export const getBoardMembers = async (boardId: string): Promise<User[]> => {
  try {
    // Fetch the board to get its members
    const response = await api.get(`/boards/${boardId}`);
    const board = response.data.data;
    
    // Extract members from board if available, otherwise return empty array
    if (board && Array.isArray(board.members)) {
      return board.members;
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch board members:", error);
    return [];
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/users");
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

export const createUser = async (name: string, email: string): Promise<User> => {
  const response = await api.post("/users", {
    name,
    email,
  });
  return response.data.data;
};

export const updateUser = async (
  id: string,
  name: string,
  email: string
): Promise<User> => {
  const response = await api.put(`/users/${id}`, {
    name,
    email,
  });
  return response.data.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
