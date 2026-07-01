import User from "../models/User";
import Board from "../models/Board";
import Card from "../models/Card";
import mongoose from "mongoose";

interface CreateUserInput {
  name: string;
  email: string;
}

type UpdateUserInput = Partial<CreateUserInput>;

export const createUser = async ({
  name,
  email,
}: CreateUserInput) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
  });

  return user;
};

export const getUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

export const getUserById = async (id: string) => {
  return User.findById(id);
};

export const updateUser = async (
  id: string,
  data: UpdateUserInput
) => {
  return User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Remove user from all boards' members arrays
    await Board.updateMany(
      { members: id },
      { $pull: { members: id } },
      { session }
    );

    // 2. Unassign user from all cards
    await Card.updateMany(
      { assignedUserId: id },
      { $set: { assignedUserId: null } },
      { session }
    );

    // 3. Delete the user
    const user = await User.findByIdAndDelete(id, { session });

    await session.commitTransaction();

    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};