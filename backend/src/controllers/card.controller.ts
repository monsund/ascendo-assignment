import { Request, Response } from "express";
import { assignUserToCard, createCard, deleteCard, getCardById, getCards, updateCard, moveCard, reorderCards } from "../services/card.service";

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

export const moveCardController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params as { id: string };
    const { listId } = req.body as { listId: string };

    const card = await moveCard(id, listId);

    return res.status(200).json({
      success: true,
      message: "Card moved successfully.",
      data: card,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Internal Server Error";

    // Handle specific errors with appropriate status codes
    if (
      errorMessage.includes("Card not found") ||
      errorMessage.includes("List not found") ||
      errorMessage.includes("Current list not found")
    ) {
      return res.status(404).json({
        success: false,
        message: errorMessage,
      });
    }

    if (
      errorMessage.includes("Cards can only be moved within the same board") ||
      errorMessage.includes("Card is already in this list")
    ) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const reorderCardsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { listId, cards } = req.body as {
      listId: string;
      cards: { id: string; position: number }[];
    };

    if (!listId || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({
        success: false,
        message: "listId and non-empty cards array are required.",
      });
    }

    await reorderCards(listId, cards);

    return res.status(200).json({
      success: true,
      message: "Cards reordered successfully.",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Internal Server Error";

    // Handle specific errors with appropriate status codes
    if (
      errorMessage.includes("List not found") ||
      errorMessage.includes("Card not found")
    ) {
      return res.status(404).json({
        success: false,
        message: errorMessage,
      });
    }

    if (errorMessage.includes("does not belong to list")) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
