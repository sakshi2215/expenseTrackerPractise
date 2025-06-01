import {
    changeCurrentPassword,
        registerUser,
        loginUser,
        logoutUser,
        getCurrentUser,
        refreshAccessToken
} from "../controllers/users.controllers.js";

import { Router } from "express";
import {jwtVerify} from "../middleware/auth.middleware.js";
import verifyJWT from "../../TODO_APP_PRACTISE/middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser),
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/me").get(jwtVerify, getCurrentUser);
router.route("/changePassword").patch( jwtVerify, changeCurrentPassword);

export default router;

