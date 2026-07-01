import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("error in globalErrorHandler:", err);

      let statusCode;
      let errorMessage = err.message;
      let errorName = err.name || "internal server error";

      if (err instanceof Prisma.PrismaClientValidationError) {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Your request is invalid. Please check your request and try again.";
            errorName = "Prisma Client Validation Error";
      } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            errorName = "Prisma Client Known Request Error";
            if (err.code === "P2002") {
                  statusCode = httpStatus.BAD_REQUEST;
                  errorMessage = "Duplicate field value entered. Please use another value.";
            } else if (err.code === "P2003") {
                  statusCode = httpStatus.BAD_REQUEST;
                  errorMessage = "Foreign key constraint failed.";
            }
            else if (err.code === "P2025") {
                  statusCode = httpStatus.NOT_FOUND,
                        errorMessage = "Record not found."
            }
      }

      else if (err instanceof Prisma.PrismaClientValidationError) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR,
                  errorMessage = "Authentication failed."
      }


      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
            errorCode: err.code || null,
            name: errorName,
            message: errorMessage,
            error: err.stack
      });
}