import express from "express";
import authController from "../controllers/authController";
import { ValidationRegistry } from "../middleware/validation";

const route = express.Router();

route.post("/Regiser", ValidationRegistry, authController.register);
route.post("/Active", authController.activeAccount);

export default route;
