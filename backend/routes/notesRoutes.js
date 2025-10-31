import express from "express";
import { 
  getallnotes, 
  createnotes, 
  updatenotes, 
  deletenotes 
} from "../Controllers/notesController.js";

const router = express.Router();

router.get("/", getallnotes);
router.post("/", createnotes);
router.put("/:id", updatenotes);
router.delete("/:id", deletenotes);

export default router;