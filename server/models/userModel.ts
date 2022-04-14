import { Schema, model } from "mongoose";
import { IUSER } from "../config/interface";

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please Enter a Name!"],
      maxlength: [20, "Your Name Is Too Long!"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Please Enter a Name!"],
      maxlength: [20, "Your Name Is Too Long!"],
      trim: true,
    },
    account: {
      type: String,
      required: true,
      maxlength: [40, "Your Acount Is Not Valid!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password!"],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dounhkhq1/image/upload/v1648414713/sample.jpg",
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default model<IUSER>("User", userSchema);
