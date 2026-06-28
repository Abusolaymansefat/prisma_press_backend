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
const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => { })

const getPostByStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => { })


const getPostByAuthor = catchAsync(async (req: Request, res: Response, next: NextFunction) => { })

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => { })

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => { })



export const postController = {
      createPost,
      getAllPost,
      getPostByStatus,
      getPostByAuthor,
      getPostById,
      updatePost,
      deletePost
}