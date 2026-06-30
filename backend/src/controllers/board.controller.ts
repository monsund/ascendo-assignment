import { Request, Response } from "express";
import { createBoard, deleteBoard, getBoardById, getBoards, updateBoard } from "../services/board.service";

export const createBoardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, privacy, members } = req.body;

    const board = await createBoard({
      name,
      privacy,
      members,
    });

    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: board,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const getBoardsController = async (
  req: Request,
  res: Response
) => {
  try {
    const boards = await getBoards();

    return res.status(200).json({
      success: true,
      data: boards,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const getBoardByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };

    const board = await getBoardById(id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const updateBoardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };
    const { name, privacy, members } = req.body as 
        { name: string; privacy: "PUBLIC" | "PRIVATE"; members: string[] };

    const board = await updateBoard(id, {
      name,
      privacy,
      members,
    });

    return res.status(200).json({
      success: true,
      message: "Board updated successfully.",
      data: board,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const deleteBoardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };

    await deleteBoard(id);

    return res.status(200).json({
      success: true,
      message: "Board deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
