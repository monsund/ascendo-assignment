import User from "../models/User";

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
  return User.findByIdAndDelete(id);
};