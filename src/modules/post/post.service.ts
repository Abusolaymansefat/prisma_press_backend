import { commentStatus, postStatus } from "../../../generated/prisma/enums";
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

      //     await prisma.post.update({
      //             where: {
      //                   id: postId,
      //             },
      //             data: {
      //                   views: {
      //                         increment: 1
      //                   }
      //             }

      //       })

      //       const post = await prisma.post.findUniqueOrThrow({
      //             where: {
      //                   id: postId
      //             },
      //             include: {
      //                   author: {
      //                         omit: {
      //                               password: true
      //                         }
      //                   },
      //                   comments: {
      //                         where: {
      //                               status: commentStatus.APPROVED
      //                         },
      //                         orderBy: {
      //                               createdAt: "desc"
      //                         }
      //                   },
      //                   _count: {
      //                         select: {
      //                               comments: true
      //                         }
      //                   }

      //             }
      //       })


      //       return post

      const transactionResult = await prisma.$transaction(async (tx) => {
            // First verify the post exists
            const existingPost = await tx.post.findUnique({
                  where: {
                        id: postId
                  }
            })

            if (!existingPost) {
                  throw new Error("Post not found")
            }

            // Update the views count
            await tx.post.update({
                  where: {
                        id: postId
                  },
                  data: {
                        views: {
                              increment: 1
                        }
                  }
            })

            const post = await tx.post.findUniqueOrThrow({
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


      })

      return transactionResult
};

const getPostByStatus = async () => {

      const transactionResult = await prisma.$transaction(
            async (tx) => {

                  // const totalPost = await tx.post.count();

                  // const totalPublishedPost = await tx.post.count({
                  //       where: {
                  //             status: postStatus.PUBLISHED
                  //       }
                  // })

                  // const totalDraftPost = await tx.post.count({
                  //       where: {
                  //             status: postStatus.DRAFT
                  //       }
                  // })

                  // const totalArchivedPost = await tx.post.count({
                  //       where: {
                  //             status: postStatus.ARCHIVED
                  //       }
                  // })

                  // const totalComments = await tx.comment.count();

                  // const totalApprovedComments = await tx.comment.count({
                  //       where: {
                  //             status: commentStatus.APPROVED
                  //       }
                  // })

                  // const totalRejectComments = await tx.comment.count({
                  //       where: {
                  //             status: commentStatus.REJECT
                  //       }
                  // })

                  // const totalPostViewsAggregate = await tx.post.aggregate({
                  //       _sum: {
                  //             views: true
                  //       }
                  // })


                  // const totalPostViews = totalPostViewsAggregate._sum.views

                  //git commit -m"create post service & get post by status service"

                  // return {
                  //       totalPost,
                  //       totalPublishedPost,
                  //       totalDraftPost,
                  //       totalArchivedPost,
                  //       totalComments,
                  //       totalApprovedComments,
                  //       totalRejectComments,
                  //       totalPostViews
                  // }

                  const [
                        totalPost,
                        totalPublishedPost,
                        totalDraftPost,
                        totalArchivedPost,
                        totalComments,
                        totalApprovedComments,
                        totalRejectComments,
                        totalPostViewsAggregate
                  ] = await Promise.all([
                        tx.post.count(),
                        tx.post.count({
                              where: {
                                    status: postStatus.PUBLISHED
                              }
                        }),
                        tx.post.count({
                              where: {
                                    status: postStatus.DRAFT
                              }
                        }),
                        tx.post.count({
                              where: {
                                    status: postStatus.ARCHIVED
                              }
                        }),
                        tx.comment.count(),
                        tx.comment.count({
                              where: {
                                    status: commentStatus.APPROVED
                              }
                        }),
                        tx.comment.count({
                              where: {
                                    status: commentStatus.REJECT
                              }
                        }),
                        tx.post.aggregate({
                              _sum: {
                                    views: true
                              }
                        })
                  ])

                  const totalPostViews = totalPostViewsAggregate._sum.views

                  return {
                        totalPost,
                        totalPublishedPost,
                        totalDraftPost,
                        totalArchivedPost,
                        totalComments,
                        totalApprovedComments,
                        totalRejectComments,
                        totalPostViews
                  }
            })

      return transactionResult
};


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