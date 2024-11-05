import { Router } from "express";
const router = Router();

//User CRUD
//Create user
router.post("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

//List users
router.get("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

//Get one user
router.get("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

//Update user
router.put("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

//Delete user
router.delete("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

export default router
