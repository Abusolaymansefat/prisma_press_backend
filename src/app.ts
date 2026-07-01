import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { postRouter } from "./modules/post/post.router";
import { commentRouter } from "./modules/comment/comment.router";
import { notFoundMiddleware } from "./middieware/notFound";
import { globalErrorHandler } from "./middieware/globalError";

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
app.use("/api/users", userRouter);

app.use("/api/auth", authRouter);

app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

// app.use((req: Request, res: Response) => {
//       res.status(404).json({
//             message: "Route not found",
//             path: req.originalUrl,
//             date: Date()
//       })
// })

//error handling middleware
app.use(notFoundMiddleware);

// global error handler 
app.use(globalErrorHandler);



export default app;
