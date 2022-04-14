import Users from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from "../config/generateToken";
import { validateEmail } from "../middleware/validation";
import jwt from "jsonwebtoken";
import { sendEMail } from "../config/sendMail";
import { ITOKEN, IUSER } from "../config/interface";

const authController = {
  // SingUp Function
  register: async (req: Request, res: Response) => {
    const BASE_URL = `${process.env.BASE_URL}`;
    try {
      const { firstname, lastname, password, account } = req.body;

      const user = await Users.findOne({ account });
      // Check if is User Is Already Exist
      if (user)
        return res
          .status(400)
          .json({ message: "This Account Is Already Exist Please Try Again" });
      //Haching Password
      const passwordHash = await bcrypt.hash(password, 12);

      // Creat New User
      const newUser = {
        first_name: firstname,
        last_name: lastname,
        password: passwordHash,
        account,
      };
      // Generate Active Token For User
      const activeToken = generateActiveToken({ newUser });

      const url = `${BASE_URL}/active/${activeToken}`;
      // Send To Email
      if (validateEmail(account)) {
        sendEMail(account, url, "Your Account has been successfully Validated");
        // Succssfully Register With Email
        return res.json({ msg: "Success! Please check your email." });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  // Active Finction
  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;
      const decode = <ITOKEN>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN}`)
      );
      const { newUser } = decode;
      if (!newUser) return res.status(400).json({ message: "Token Invalid" });

      // Save New User In Database
      await new Users(newUser).save();
      res.json({ message: "Welcome To TSApp" });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.keys(error.keyValue)[0] + "is All Ready Exist";
      } else {
        errMsg = error.message;
      }
      res.status(500).json({ message: errMsg });
    }
  },
  // Login Function
  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body;
      console.log({ account, password });
      const isUser = await Users.findOne({ account });
      console.log({ isUser });
      if (!isUser)
        return res
          .status(400)
          .json({ message: "Email Or Password Is Incorrect" });

      // If Email Exist
      loginUser(isUser, password, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

const loginUser = async (user: IUSER, password: string, res: Response) => {
  // If password is incorrect
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Email Or Password Is Incorrect" });

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/refresh_token",
    maxAge: 1000 * 60 * 60 * 30 * 24,
  });
};

export default authController;
