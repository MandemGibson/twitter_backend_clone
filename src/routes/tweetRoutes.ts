import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

//Tweet CRUD
//Create Tweet
router.post("/", async (req, res) => {
  try {
    const { content, image, userId } = req.body;

    const tweet = await prisma.tweet.create({
      data: { content, image, userId },
    });

    res.status(201).json(tweet);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//List Tweet
router.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({ include: { user: true } });
  res.status(200).json(allTweets);
});

//Get one Tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({
    where: { id },
    include: { user: true },
  });
  res.status(200).json(tweet);
});

//Update Tweet
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, image } = req.body;
    const updatedTweet = await prisma.tweet.update({
      where: { id },
      data: { content, image },
    });
    res.status(200).json(updatedTweet);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Delete Tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.tweet.delete({
    where: { id },
  });
  res.sendStatus(204);
});

export default router;
