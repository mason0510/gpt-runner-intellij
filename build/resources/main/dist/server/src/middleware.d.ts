import type { NextFunction, Request, Response } from 'express';
export declare function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void;
