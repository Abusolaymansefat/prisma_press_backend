import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import httpStatus from "http-status"
import { sendResponse } from "../../utils/sendResponse";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

      const id = req.user?.id;

      const payload = req.body;

      const result = await postService.createPost(payload, id as string);
      sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "post created successfully",
            data: {
                  result
            }
      })
})

const getAllPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

      const result = await postService.getAllPost();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "post Retrieved successfully",
            data: result
      })
})
const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.postId;

      if (!postId) {
            throw new Error("post id is required")
      }

      const result = await postService.getPostById(postId as string);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "post Retrieved successfully",
            data: result
      })
})

const getPostByStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 

      const result = await postService.getPostByStatus();

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "post Retrieved successfully",
            data: result
      })
})

const getPostByAuthor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

      const authorId = req.user?.id;

      const result = await postService.getPostByAuthor(authorId as string);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "my post Retrieved successfully",
            data: result
      })
 })



const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 

      const authorId = req.user?.id;
      const postId =req.params.postId;
      const payload = req.body;
      const isAdmin = req.user?.role === "ADMIN";

      const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "post updated successfully",
            data: result
      })
})

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 

      const authorId = req.user?.id;
      const postId =req.params.postId;
      const isAdmin = req.user?.role === "ADMIN";

      await postService.deletePost(postId as string, authorId as string, isAdmin);

      sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "post deleted successfully",
            data: null
      })
})


export const postController = {
      createPost,
      getAllPost,
      getPostByStatus,
      getPostByAuthor,
      getPostById,
      updatePost,
      deletePost
}