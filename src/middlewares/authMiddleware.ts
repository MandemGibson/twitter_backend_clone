import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers["authorization"];
    const jwtToken = authHeader?.split(" ")[1];

    if (!jwtToken) return res.status(401).json({ message: "Unauthorized" });

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;

    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    const dbToken = await prisma.token.findUnique({
      where: { id: decoded.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiresIn < new Date())
      return res
        .status(401)
        .json({ message: "Unauthorized - API token invalid" });

    req.user = dbToken.user;
    next();
  } catch (error) {
    console.error(error);
  }
};
