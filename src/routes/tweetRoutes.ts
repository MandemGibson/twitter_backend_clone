import { Router } from "express";
const router = Router();

//Tweet CRUD
//Create Tweet
router.post("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

//List Tweet
router.get("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

//Get one Tweet
router.get("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

//Update Tweet
router.put("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

//Delete Tweet
router.delete("/:id", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

export default router
