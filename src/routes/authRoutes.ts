import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import crypto from "crypto";

const router = Router();
const prisma = new PrismaClient();

//generate a random 8 digit number as email token
const generateEmailToken = () => {
  return crypto.randomInt(10000000, 99999999);
};

const generateAuthToken = (tokenId: string): string => {
  const jwtPayload = { tokenId };

  const JWT_SECRET = process.env.JWT_SECRET as string;
  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: "HS256",
    noTimestamp: true,
  });
};

//create a user if it doesn't exist
//generate the email token and send to the email
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    //generate token
    //hash generated token to store in the db
    const emailToken = generateEmailToken();
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
router.post("/authenticate", async (req, res): Promise<any> => {
  try {
    const { email, emailToken } = req.body;
    const hashedEmailToken = crypto
      .createHash("sha256")
      .update(emailToken.toString())
      .digest("hex");

    const token = await prisma.token.findUnique({
      where: { emailToken: hashedEmailToken },
      include: { user: true },
    });

    if (!token || !token.valid)
      return res.status(401).json({ error: "Unauthorized" });

    if (token.expiresIn < new Date())
      return res.status(401).json({ error: "Token has expired" });

    if (token.user?.email !== email)
      return res.status(401).json({ error: "Unauthorized" });

    //generate an API token
    const expiration = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);

    const createdApiToken = await prisma.token.create({
      data: {
        type: "API",
        expiresIn: expiration,
        user: {
          connect: { email },
        },
      },
    });

    //invalidate email token
    await prisma.token.update({
      where: { id: token.id },
      data: {
        valid: false,
      },
    });

    //generate jwt token
    const authToken = generateAuthToken(createdApiToken.id);

    res.status(200).json({ authToken });
  } catch (error) {
    console.log(error);
  }
});

export default router;
