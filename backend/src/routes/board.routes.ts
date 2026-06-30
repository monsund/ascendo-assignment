import { Router } from "express";
import { createBoardController, deleteBoardController, getBoardByIdController, getBoardsController, updateBoardController } from "../controllers/board.controller";
import { getListsByBoardController } from "../controllers/list.controller";

const router = Router();

router.post("/", createBoardController);
router.get("/", getBoardsController);
router.get("/:id", getBoardByIdController);
router.put("/:id", updateBoardController);
router.delete("/:id", deleteBoardController);
router.get("/:boardId/lists", getListsByBoardController);

export default router;
