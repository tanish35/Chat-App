import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();

router.route("/").post(registerUser).get(requireAuth, allUsers);
router.route("/login").post(authUser);
export default router;
