import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";


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


export const auth = (...requiredRoles: Role[]) => {
      return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const token =
                  req.cookies.accessToken ||
                  (req.headers.authorization?.startsWith("Bearer")
                        ? req.headers.authorization.split(" ")[1]
                        : req.headers.authorization);

            if (!token) {
                  throw new Error("You are not logged in please login to get access");
            }

            const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

            if (!verifiedToken.success) {
                  throw new Error(verifiedToken.error);
            }

            const { id, email, name, role } = verifiedToken.data as JwtPayload & {
                  role: Role;
            };

            if (requiredRoles.length && !requiredRoles.includes(role)) {
                  throw new Error(
                        "Forbidden. You don't have permission to access this route"
                  );
            }

            const user = await prisma.user.findUnique({
                  where: {
                        id,
                  },
            });

            if (!user) {
                  throw new Error("user not found. please log in again");
            }

            if (user.activeStatus === "BLOCKED") {
                  throw new Error("your account is blocked plase contact admin/ support");
            }

            req.user = {
                  id,
                  email,
                  name,
                  role
            }
            next();
      })

}