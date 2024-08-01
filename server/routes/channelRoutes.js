import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
    createChanel,
    getChannelsMessages,
    getUserChannels,
} from "../controllers/channelController.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChanel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);
channelRoutes.get(
    "/get-channel-messages/:channelId",
    verifyToken,
    getChannelsMessages
);

export default channelRoutes;
