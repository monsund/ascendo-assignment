import { Request, Response } from "express";
import { createList, deleteList, getListById, getLists, getListsByBoard, updateList } from "../services/list.service";

export const createListController = async (
  req: Request,
  res: Response
) => {
  try {
    const { boardId, title } = req.body;

    const list = await createList({
      boardId,
      title,
    });

    return res.status(201).json({
      success: true,
      message: "List created successfully.",
      data: list,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const getListsController = async (
  req: Request,
  res: Response
) => {
  try {
    const lists = await getLists();

    return res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

export const getListByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };

    const list = await getListById(id);

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

export const updateListController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };
    const { title } = req.body;

    const list = await updateList(id, {
      title,
    });

    return res.status(200).json({
      success: true,
      message: "List updated successfully.",
      data: list,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

export const deleteListController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };

    await deleteList(id);

    return res.status(200).json({
      success: true,
      message: "List deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

export const getListsByBoardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { boardId } = req.params as { boardId: string };

    const lists = await getListsByBoard(boardId);

    return res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};
