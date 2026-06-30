import { postStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface ICreatePostPayload {
      title: string;
      content: string;
      thimbnail?: string;
      isFeatured?: boolean;
      status?: postStatus;
      tags: string[];
}


export interface IUpdatePostPayload{
      title?: string;
      content?: string;
      thimbnail?: string;
      isFeatured?: boolean;
      status?: postStatus;
      tags?: string[];
}


export interface IPostQuery extends PostWhereInput {
      // title?: string
      // content?: string

      searchTerm?: string
      page?: string
      limit?: string
      sortOrder?: string
      sortBy?: string
}