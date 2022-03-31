import Users from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateActiveToken } from "../config/generateToken";
import { validateEmail } from "../middleware/validation";
import jwt from "jsonwebtoken";
import { sendEMail } from "../config/sendMail";
import { ITOKEN, IUSER } from "../config/interface";

const authController = {
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
  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;
      const decode = <ITOKEN>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN}`)
      );
      const { newUser } = decode;
      // Save New User In Database
      const user = new Users(newUser);
      console.log(user);

      await user.save();
      res.json({ message: "Welcome To TSApp" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default authController;
