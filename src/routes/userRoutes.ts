import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//User CRUD
//Create user
router.post("/", async (req, res) => {
  try {
    const { email, name, username } = req.body;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        bio: "We do not know any info about this user",
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//List users
router.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.status(200).json(allUsers);
});

//Get one user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { tweets: true },
  });
  res.status(200).json(user);
});

//Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, name, image } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { bio, name, image },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id },
  });
  res.sendStatus(204);
});

export default router;
