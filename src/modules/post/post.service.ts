import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {

      const result = await prisma.post.create({
            data: {
                  ...payload,
                  authorId: userId
            }
      })

      return result
};

const getAllPost = async() => {

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

const getPostById = async () => {

};

const getPostByStatus = () => { };

const getPostByAuthor = () => { };

const updatePost = () => { };

const deletePost = () => { };

export const postService = {
      createPost,
      getAllPost,
      getPostByStatus,
      getPostByAuthor,
      getPostById,
      updatePost,
      deletePost
}