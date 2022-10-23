const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").lean();
  if (!users) {
    res.status(404).json({ message: "No users found" });
  }
  res.status(200).json(users);
});

//@desc create new user
//@route POST /users
//@access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    res
      .status(400)
      .json({ message: "Please provide username, password and role(s)" });
  }

  //check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    res.status(409).json({ message: "Username already exists" });
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = {
    username,
    password: hashedPassword,
    roles,
  };

  //create a new user

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `User ${username}created successfully` });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

//@desc update user
//@route PATCH /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  //confirm data
  if (
    !id ||
    !username ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    res.status(400).json({
      message: "All fields are required",
    });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  //check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  //Allow updates to the original user
  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: "Username already exists" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `User ${updatedUser.username} updated successfully` });
});

//@desc delete user
//@route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  //confirm data
  if (!id) {
    res.status(400).json({
      message: "Please provide user id",
    });
  }

  const notes = await Notes.findOne({ user: id }).lean().exec();
  if (notes?.length) {
    res.status(409).json({ message: "User has assigned notes. " });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted successfully`;

  res.json({ message: reply });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
