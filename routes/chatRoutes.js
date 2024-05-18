import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();
import {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from "../controllers/chatController.js";

router.route("/").post(requireAuth, accessChat);
router.route("/").get(requireAuth, fetchChat);
router.route("/group").post(requireAuth, createGroupChat);
router.route("/rename").put(requireAuth, renameGroup);
router.route("/groupremove").put(requireAuth, removeFromGroup);
router.route("/groupadd").put(requireAuth, addToGroup);
export default router;
