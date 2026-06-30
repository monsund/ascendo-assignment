import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/errorHandler";
import boardRoutes from "./routes/board.routes";
import listRoutes from "./routes/list.routes";
import cardRoutes from "./routes/card.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server health is ok",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

app.use(errorHandler);

export default app;