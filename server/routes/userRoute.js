import express from "express";


import { signup, signin, forgotPassword, resetPassword, getLoginStatus, logoutUser } from "../controllers/user.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot', forgotPassword);
router.put('/reset', resetPassword);
router.get('/loggedIn', getLoginStatus);
router.get('/logout', logoutUser);

export default router;
