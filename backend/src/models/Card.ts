import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICard extends Document {
  boardId: Types.ObjectId;
  listId: Types.ObjectId;
  assignedUserId?: Types.ObjectId | null;

  name: string;
  description: string;

  position: number;

  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    listId: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },

    assignedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<ICard>("Card", cardSchema);
