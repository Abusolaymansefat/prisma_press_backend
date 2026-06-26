import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPlayload } from "./user.interface";




const registerUserIntoDB = async(payload: RegisterUserPlayload) => {
      const {name, email, password, profilePhoto} = payload
      const isUserExist = await prisma.user.findUnique({
            where: { email }
      })

      if (isUserExist) {
            throw new Error("User already exists with this email.");
      }

      const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

      const createdUser = await prisma.user.create({
            data: {
                  name,
                  email,
                  password: hashedPassword,
                  profile: {
                        create: {
                              profilePhoto
                        }
                  }
            }
      });

      // await prisma.profile.create({
      //       data: {
      //             userId: createdUser.id,
      //             profilePhoto
      //       }
      // })

      const user = await prisma.user.findUnique({
            where: {
                  id: createdUser.id,
                  email: createdUser.email || email
            },

            omit: {
                  password: true
            },
            include: {
                  profile: true
            }
      })
      return user;

}


const getMyProfileInitDB = async (userId: string) => {

      const user = await prisma.user.findUniqueOrThrow({
            where: {
                  id: userId
            },
            omit: {
                  password: true
            },
            include: {
                  profile: true
            }
      })
      return user
};

const updateMyprofileDB = async(userId: string, payload: any) => {
      const {name, email, profilePhoto, bio} = payload;
      const updateUser = await prisma.user.update({
            where: {id : userId},
            data: {
                  name,
                  email,
                  profile: {
                        update: {
                              profilePhoto,
                              bio
                        }
                  }
            },

            omit: {
                  password: true
            },
            include: {
                  profile: true
            }
      })

      return updateUser;
}

export const userService = {
      registerUserIntoDB,
      getMyProfileInitDB,
      updateMyprofileDB
}