
import { Request, Response } from "express";

export default async function handleRequest(req: Request, res: Response) {
    res.cookie('token', '', { maxAge: 0 }).status(200).send();
}

