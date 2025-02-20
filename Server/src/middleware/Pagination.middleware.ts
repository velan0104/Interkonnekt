import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../lib/type.js";

export const paginate = (model: any) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 2;
    const skip = (page - 1) * limit;

    try {
      const totalItems = await model.countDocuments();
      const results = await model.find().skip(skip).limit(limit);

      // Prepare response metadata
      const pagination = {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: skip + limit < totalItems,
        hasPrevPage: page > 1,
      };

      // Attach paginated results to response
      res.locals.paginatedResults = {
        pagination,
        data: results,
      };

      next();
    } catch (error) {
      res.status(500).send("Internal server error");
      return;
    }
  };
};
