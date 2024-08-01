import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messagesModel.js";
import Channel from "./models/channelModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (socket, message) => {
        // Validate message object
        if (!message || !message.sender || !message.recipient) {
            console.error("Invalid message object received:", message);
            return;
        }

        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        try {
            const createdMessage = await Message.create(message);

            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate(
                    "recipient",
                    "id email firstName lastName image color"
                );

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", messageData);
            }

            if (senderSocketId) {
                io.to(senderSocketId).emit("receiveMessage", messageData);
            }
        } catch (error) {
            console.error("Error saving message to database:", error);
        }
    };

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;

        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timeStamp: new Date(),
            fileUrl,
        });

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });

        const channel = await Channel.findById(channelId).populate("members");
        const finalData = { ...messageData._doc, channelId: channel._id };
        if (finalData && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit(
                        "receiveChannelMessage",
                        finalData
                    );
                }
            });
            const adminSocketId = userSocketMap.get(
                channel.admin._id.toString()
            );
            if (adminSocketId) {
                io.to(adminSocketId).emit("receiveChannelMessage", finalData);
            }
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(
                `User connected: ${userId} with socket id ${socket.id}`
            );
        } else {
            console.log("User ID not provided during connection!");
        }

        socket.on("sendMessage", (message) => sendMessage(socket, message));
        socket.on("sendChannelMessage", (message) =>
            sendChannelMessage(message)
        );
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
