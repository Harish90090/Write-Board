import Note from "../models/notes.js";

export async function getallnotes(req, res) {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("error in getallnotes ", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function createnotes(req, res) {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error("error in createnotes ", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function updatenotes(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id, 
      { title, content }, 
      { new: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    console.error("error in updatenotes ", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function deletenotes(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("error in deletenotes ", error);
    res.status(500).json({ message: "internal server error" });
  }
}