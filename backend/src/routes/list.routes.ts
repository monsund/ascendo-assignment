import { Router } from "express";
import { createListController, deleteListController, getListByIdController, getListsController, updateListController } from "../controllers/list.controller";

const router = Router();

router.post("/", createListController);
router.get("/", getListsController);
router.get("/:id", getListByIdController);
router.put("/:id", updateListController);
router.delete("/:id", deleteListController);

export default router;