import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction)  =>{});
const getCommentByAuthorId = () => {};
const getCommentByCommentId = () => {};
const updateComment = () => {};
const deleteComment = () => {};
const moderateComment = () => {};


export const commentController = {
      createComment,
      getCommentByAuthorId,
      getCommentByCommentId,
      updateComment,
      deleteComment,
      moderateComment
}