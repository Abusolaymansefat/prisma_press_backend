import { commentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {

      const result = await prisma.post.create({
            data: {
                  ...payload,
                  authorId: userId
            }
      })

      return result
};

const getAllPost = async () => {

      const posts = await prisma.post.findMany({
            include: {
                  author: {
                        omit: {
                              password: true
                        }
                  },
                  comments: true
            }
      })

      return posts;

};

const getPostById = async (postId: string) => {
      // const post = await prisma.post.findUnique({
      //       where: {
      //             id: postId
      //       }
      // })

      // if (!post) {
      //       throw new Error("Post not found");
      // }

    await prisma.post.update({
            where: {
                  id: postId,
            },
            data: {
                  views: {
                        increment: 1
                  }
            }
            
      })

      const post = await prisma.post.findUniqueOrThrow({
            where: {
                  id: postId
            },
            include: {
                  author: {
                        omit: {
                              password: true
                        }
                  },
                  comments: {
                        where: {
                              status: commentStatus.APPROVED
                        },
                        orderBy: {
                              createdAt: "desc"
                        }
                  },
                  _count: {
                        select: {
                              comments: true
                        }
                  }

            }
      })


      return post
};

const getPostByStatus = () => { };
const getPostByAuthor = async (authorId: string) => {

      const result = await prisma.post.findMany({
            where: {
                  authorId
            },
            orderBy: {
                  createdAt: "desc"
            },
            include: {
                  author: {
                        omit: {
                              password: true
                        }
                  },
                  _count: {
                        select: {
                              comments: true
                        }
                  }
            }
      })
      return result
};


const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {

      const post = await prisma.post.findUniqueOrThrow({
            where: {
                  id: postId
            }
      })

      if (!isAdmin && post.authorId !== authorId) {
            throw new Error("You are not authorized to update this post");
      }

      const result = await prisma.post.update({
            where: {
                  id: postId
            },
            data: {
                  ...payload
            },
            include: {
                  author: {
                        omit: {
                              password: true
                        }
                  },
                  comments: true
            }
      })

      return result
};

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {

      const post = await prisma.post.findUniqueOrThrow({
            where: {
                  id: postId
            }
      })

      if (!isAdmin && post.authorId !== authorId) {
            throw new Error("You are not authorized to delete this post");
      }

      await prisma.post.delete({
            where: {
                  id: postId
            }
      })


};




export const postService = {
      createPost,
      getAllPost,
      getPostByStatus,
      getPostByAuthor,
      getPostById,
      updatePost,
      deletePost
}