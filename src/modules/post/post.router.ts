import { Router } from "express";
import { auth } from "../../middieware/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.createPost);

router.get("/", postController.getAllPost);

// Specific routes must come BEFORE dynamic :postId route
router.get("/status", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.getPostByStatus);

router.get("/my-posts", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.getPostByAuthor);

router.get("/:postId", postController.getPostById);


router.patch("/:postId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.updatePost);

router.delete("/:postId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.deletePost);



export const postRouter = router;