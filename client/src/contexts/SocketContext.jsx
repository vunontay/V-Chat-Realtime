import { useAppStore } from "@/store";
import { HOST } from "@/utils/constant";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            socket.current.on("disconnect", () => {
                console.log("Disconnected from socket server");
            });

            const handleReceiveMessage = (message) => {
                const {
                    selectedChatType,
                    selectedChatData,
                    addMessage,
                    addContactInDMContacts,
                } = useAppStore.getState();
                if (
                    (selectedChatType !== undefined &&
                        selectedChatData._id === message.sender._id) ||
                    selectedChatData._id === message.recipient._id
                ) {
                    addMessage(message);
                }
                addContactInDMContacts(message);
            };
            const handleReceiveChannelMessage = (message) => {
                const {
                    selectedChatType,
                    selectedChatData,
                    addMessage,
                    addChannelInChannelList,
                } = useAppStore.getState();
                if (
                    selectedChatType !== undefined &&
                    selectedChatData._id === message.channelId
                ) {
                    addMessage(message);
                }
                addChannelInChannelList(message);
            };
            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on(
                "receiveChannelMessage",
                handleReceiveChannelMessage
            );

            return () => {
                if (socket.current) {
                    socket.current.off("receiveMessage", handleReceiveMessage);
                    socket.current.disconnect();
                }
            };
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
