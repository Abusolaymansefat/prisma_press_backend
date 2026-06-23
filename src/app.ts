import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRouter } from "./modules/user/user.route";

const app: Application = express();


app.use(cors({
      origin: config.app_url,
      credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
      res.send("prismaa press start page in working condition.");
});

// app.post()
app.use("/api/users", userRouter)

export default app;
