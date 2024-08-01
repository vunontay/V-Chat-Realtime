import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/channelRoutes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

const databaseUrl = process.env.DATABASE_URL;

app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/messages", messagesRoutes);
app.use("/api/v1/channel", channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

setupSocket(server);

mongoose
    .connect(databaseUrl, {
        maxPoolSize: 50,
    })
    .then(() => {
        console.log(`DB connection Successfully`);
    })
    .catch((error) => {
        console.log(error.message);
    });
