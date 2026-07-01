import { Request, Response } from "express";
import { assignUserToCard, createCard, deleteCard, getCardById, getCards, updateCard } from "../services/card.service";

export const createCardController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      boardId,
      listId,
      assignedUserId,
      name,
      description,
    } = req.body;

    const card = await createCard({
      boardId,
      listId,
      assignedUserId,
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Card created successfully.",
      data: card,
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

export const getCardsController = async (
  req: Request,
  res: Response
) => {
  try {
    const cards = await getCards();

    return res.status(200).json({
      success: true,
      data: cards,
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

export const getCardByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };

    const card = await getCardById(id);

    return res.status(200).json({
      success: true,
      data: card,
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

export const updateCardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };
    const { name, description } = req.body;

    const card = await updateCard(id, {
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Card updated successfully.",
      data: card,
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

export const deleteCardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };

    await deleteCard(id);

    return res.status(200).json({
      success: true,
      message: "Card deleted successfully.",
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

export const assignUserToCardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };
    const { assignedUserId } = req.body as { assignedUserId: string };

    const card = await assignUserToCard(id, assignedUserId);

    return res.status(200).json({
      success: true,
      message: "User assigned successfully.",
      data: card,
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
