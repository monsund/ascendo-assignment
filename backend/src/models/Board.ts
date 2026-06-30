import { Schema, model, Types } from "mongoose";

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
      trim: true,
    },

    privacy: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
    },

    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Board = model("Board", boardSchema);

export default Board;