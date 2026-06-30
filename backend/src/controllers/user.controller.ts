import { Request, Response } from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../services/user.service";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body as { name: string; email: string };

    const user = await createUser({
      name,
      email,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const getUsersController = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };;

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const updateUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };
    const { name, email } = req.body as { name?: string; email?: string };

    const user = await updateUser(id, { name, email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };

    const user = await deleteUser(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
