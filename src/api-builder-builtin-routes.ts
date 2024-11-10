
import { Router } from "express";
export const router = Router();


import Signup from './api-builder-builtin-routes/signup';
router.post('/signup', Signup);


import Login from './api-builder-builtin-routes/login';
router.post('/login', Login);


import Logout from './api-builder-builtin-routes/logout';
router.post('/logout', Logout);