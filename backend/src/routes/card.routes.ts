import { Router } from "express";
import { assignUserToCardController, createCardController, deleteCardController, getCardByIdController, getCardsController, updateCardController, moveCardController } from "../controllers/card.controller";

const router = Router();

router.post("/", createCardController);
router.get("/", getCardsController);
router.get("/:id", getCardByIdController);
router.put("/:id", updateCardController);
router.delete("/:id", deleteCardController);
router.put("/:id/assign", assignUserToCardController);
router.patch("/:id/move", moveCardController);

export default router;