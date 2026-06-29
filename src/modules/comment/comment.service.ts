import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload, IModerateCommentPayload, IUpdateCommentPayload } from "./comment.interface";

const createComment = async (authorId: string, payload: ICreateCommentPayload) => {

      await prisma.post.findUnique({
            where: {
                  id: payload.postId
            }

      })

      const comment = await prisma.comment.create({
            data: {
                  ...payload,
                  authorId
            }
      })

      return comment
};


const getCommentByAuthorId = async (authorId: string) => {

      const comments = await prisma.comment.findMany({
            where: {
                  authorId
            },
            orderBy: {
                  createdAt: "desc"
            },
            include: {
                  post: {
                        select: {
                              id: true,
                              title: true

                        }
                  }
            }
      })

      return comments
};


const getCommentByCommentId = async (postId: string) => {

      const comments = await prisma.comment.findMany({
            where: {
                  postId
            }
      })

      return comments
};
const updateComment = async (commentId: string, data: IUpdateCommentPayload, authorId: string) => {
}
const moderateComment = async (id: string, data: IModerateCommentPayload) => {
}
const deleteComment = async (commentId: string, authorId: string) => {
}


export const commentService = {
      createComment,
      getCommentByAuthorId,
      getCommentByCommentId,
      updateComment,
      deleteComment,
      moderateComment
}


