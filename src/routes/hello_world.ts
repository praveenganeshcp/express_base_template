import { Request, Response } from "express";

export default async function handleRequest(req: Request, res: Response) {
  res.json({ message: "hello world" });
}
