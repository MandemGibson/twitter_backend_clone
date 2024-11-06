import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import crypto from "crypto";

const router = Router();
const prisma = new PrismaClient();

//generate a random 8 digit number as email token
const generateToken = () => {
  return crypto.randomInt(10000000, 99999999);
};

//create a user if it doesn't exist
//generate the email token and send to the email
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    //generate token
    //hash generated token to store in the db
    const emailToken = generateToken();
    const hashedEmailToken = crypto
      .createHash("sha256")
      .update(emailToken.toString())
      .digest("hex");

    const expiration = new Date(new Date().getTime() + 10 * 60 * 1000);

    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken: hashedEmailToken,
        expiresIn: expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });

    console.log(createdToken);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//validate the email token
//generate a long-lived jwt token
router.post("/authenticate", (req, res) => {
  res.status(501).send("Not Implemented");
});

export default router;
