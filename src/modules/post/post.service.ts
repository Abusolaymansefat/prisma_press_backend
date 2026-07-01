import { commentStatus, postStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {

      const result = await prisma.post.create({
            data: {
                  ...payload,
                  authorId: userId
            }
      })

      return result
};



const getAllPost = async (query: IPostQuery) => {

      const limit = query.limit ? Number(query.limit) : 10;
      const page = query.page ? Number(query.page) : 1;
      const skip = (page - 1) * limit;

      const sortBy = query.sortBy ? query.sortBy : "createdAt";
      const sortOrder = query.sortOrder ? query.sortOrder : "desc";
      const tags = query.tags ? JSON.parse(query.tags as string) : null;

      const tagsArray = Array.isArray(tags) ? tags : [];

      const andConditions: PostWhereInput[] = [];

      if (query.searchTerm) {

            andConditions.push({
                  OR: [
                        {
                              title: {
                                    contains: query.searchTerm,
                                    mode: "insensitive"
                              }
                        },
                        {
                              content: {
                                    contains: query.searchTerm,
                                    mode: "insensitive"
                              }
                        }
                  ]
            })
      }

      if (query.title) {

            andConditions.push({
                  title: query.title
            })
      }

      if (query.content) {
            andConditions.push({
                  content: query.content
            })
      }

      if (query.authorId) {
            andConditions.push({
                  authorId: query.authorId
            })
      }

      if (query.isFeatured) {
            andConditions.push({
                  isFeatured: Boolean(query.isFeatured)
            })
      }

      if (query.tags && tagsArray.length > 0) {
            andConditions.push({
                  tags: {
                        hasSome: tagsArray
                  }
            })
      }

      if (query.status) {
            andConditions.push({
                  status: query.status
            })
      }

      // 

      const posts = await prisma.post.findMany({

            //filter / exact match without and operator
            // where:{
            //       title: "My secend Post and Updated! ",
            //       content: "leow messi",
            // },


            //filter / exact match with and operator
            // where: {
            //       AND: [
            //             {title: "My secend Post and Updated! "},
            //             {content: "leow messi"},
            //       ]
            // },

            // searching / partial match with or operator

            // where: {
            // title: {
            //       contains: "messi",
            //       mode: "insensitive"
            // },
            // content: {
            //       contains: "messi",
            //       mode: "insensitive"
            // }
            // },

            // searching / partial match with or operator
            // where: {
            //       OR: [
            //             {title: {
            //             contains: "messi",
            //             mode: "insensitive"
            //       }
            //       },
            //             {content: {
            //             contains: "messi",
            //             mode: "insensitive"
            //       }}
            //       ]
            // },

            // combining search(or operator) & filtering(and operator) with and operator

            // where: {
            //       // searching & filtering
            //       AND: [
            //             {
            //                   // search title or comments content
            //                   OR: [
            //                         {
            //                               title: {
            //                                     contains: "messi",
            //                                     mode: "insensitive"
            //                               }
            //                         },
            //                         {
            //                               comments: {
            //                                     some: {
            //                                           content: {
            //                                                 contains: "messi",
            //                                                 mode: "insensitive"
            //                                           }
            //                                     }
            //                               }
            //                         }
            //                   ]
            //             },

            //             // filtering
            //             {
            //                   title: "leow messi"
            //             },
            //             {
            //                   content: "leow messi"
            //             }
            //       ]
            // },
            // take: 1,
            // take: 2,

            // skip: 1,
            // skip: 2,
            // skip: 3,



            //dynamic search filtering with and operator
            // where: {
            //       AND: [
            //             query.searchTerm ? {
            //                   OR: [
            //                         {
            //                               title: {
            //                                     contains: query.searchTerm,
            //                                     mode: "insensitive"
            //                               }
            //                         },
            //                         {
            //                               comments: {
            //                                     some: {
            //                                           content: {
            //                                                 contains: query.searchTerm,
            //                                                 mode: "insensitive"
            //                                           }
            //                                     }
            //                               }
            //                         }
            //                   ]
            //             } : {},
            //             // title filtering
            //             query.title ? { title: query.title } : {},
            //             // content filtering
            //             query.content ? { content: query.content } : {}
            //       ]
            // },


            where: {
                  AND: andConditions
            },

            // dynamic pagination & sorting
            take: limit,
            skip: skip,

            orderBy: {
                  //sortBy : sortOrder
                  [sortBy]: sortOrder
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