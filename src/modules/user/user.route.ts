import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";

const router = Router();

declare global {
      namespace Express {
            interface Request {
                  user?: {
                        id: string;
                        email: string;
                        name: string;
                        role: Role;
                  }
            }
      }
}

router.post("/register", userController.registerUser);

router.get("/me", (req: Request, res: Response, next: NextFunction) => {
      console.log(req.cookies)
      const { accessToken } = req.cookies;
      console.log(accessToken);

      const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);


      // console.log(veryfyToken);


      if (typeof verifiedToken === "string") {
            throw new Error(verifiedToken)
      }
      const { id, email, name, role } = verifiedToken;

      // const requiredRoles = ["ADMIN", "AUTHOR", "USER"];
      const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

      if(!requiredRoles.includes(role)){
            return res.status(403).json ({
                  success: false,
                  statusCode: httpStatus.FORBIDDEN,
                  message: "You are not authorized to access this route",
            })
      }
      req.user = {
            id,
            email,
            name,
            role
      };

      next();
}, userController.getMyProfile);

export const userRouter = router;