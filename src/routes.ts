import { Router } from "express";
export const router = Router();

import getAllUsers from "./routes/hello_world"

router.get('/hello_world', getAllUsers);


