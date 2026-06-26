import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middieware/auth";

const router = Router();


router.post("/register", userController.registerUser);


// auth() => ...requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER]
// const auth = (...requiredRoles: Role[]) => {
//       return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//             const token =
//                   req.cookies.accessToken ||
//                   (req.headers.authorization?.startsWith("Bearer")
//                         ? req.headers.authorization.split(" ")[1]
//                         : req.headers.authorization);

//             if (!token) {
//                   throw new Error("You are not logged in please login to get access");
//             }

//             const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

//             if (!verifiedToken.success) {
//                   throw new Error(verifiedToken.error);
//             }

//             const { id, email, name, role } = verifiedToken.data as JwtPayload & {
//                   role: Role;
//             };

//             if (requiredRoles.length && !requiredRoles.includes(role)) {
//                   throw new Error(
//                         "Forbidden. You don't have permission to access this route"
//                   );
//             }

//             const user = await prisma.user.findUnique({
//                   where: {
//                         id,
//                   },
//             });

//             if (!user) {
//                   throw new Error("user not found. please log in again");
//             }

//             if (user.activeStatus === "BLOCKED") {
//                   throw new Error("your account is blocked plase contact admin/ support");
//             }

//             req.user = {
//                   id,
//                   email,
//                   name,
//                   role
//             }
//             next();
//       })

// }

router.get("/me",
      //       (req: Request, res: Response, next: NextFunction) => {
      //       console.log(req.cookies)
      //       const { accessToken } = req.cookies;
      //       console.log(accessToken);

      //       const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
      //       // console.log(veryfyToken);

      //       if (!verifiedToken.success) {
      //             throw new Error(verifiedToken.error);
      //       }


      //       // if (typeof verifiedToken === "string") {
      //       //       throw new Error(verifiedToken)
      //       // }
      //       const { id, email, name, role } = verifiedToken.data as JwtPayload;

      //       // const requiredRoles = ["ADMIN", "AUTHOR", "USER"];
      //       const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

      //       if (!requiredRoles.includes(role)) {
      //             return res.status(403).json({
      //                   success: false,
      //                   statusCode: httpStatus.FORBIDDEN,
      //                   message: "You are not authorized to access this route",
      //             })
      //       }
      //       req.user = {
      //             id,
      //             email,
      //             name,
      //             role
      //       };

      //       next();
      // },
      auth(Role.ADMIN, Role.AUTHOR, Role.USER),
      userController.getMyProfile);


router.put("/my-profile",
      auth(Role.ADMIN, Role.AUTHOR, Role.USER),
      userController.updateMyProfile);

export const userRouter = router;