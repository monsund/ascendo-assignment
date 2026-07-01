import mongoose, { Document, Schema, Types } from "mongoose";

export interface IList extends Document {
  boardId: Types.ObjectId;
  title: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const listSchema = new Schema<IList>(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    title: {
      type: String,
      required: true,
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

export default mongoose.model<IList>("List", listSchema);