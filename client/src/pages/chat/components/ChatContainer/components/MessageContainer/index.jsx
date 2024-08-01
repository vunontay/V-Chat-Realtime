import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { checkIfImage } from "@/utils";
import {
    GET_ALL_MESSAGES_ROUTES,
    GET_CHANNEL_MESSAGES,
    HOST,
} from "@/utils/constant";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
const MessageContainer = () => {
    const scrollRef = useRef();
    const {
        selectedChatData,
        selectedChatType,
        selectedChatMessages,
        setSelectedChatMessages,
        setFileDownloadProgress,
        setIsDownLoading,
        userInfo,
    } = useAppStore();

    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await apiClient.post(
                    GET_ALL_MESSAGES_ROUTES,
                    { id: selectedChatData._id },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.messages) {
                    setSelectedChatMessages(response.data.messages);
                }
            } catch (error) {
                console.log(error);
            }
        };
        const getChannelMessages = async () => {
            try {
                const response = await apiClient.get(
                    `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
                    { withCredentials: true }
                );
                if (response.data.messages) {
                    setSelectedChatMessages(response.data.messages);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (selectedChatData._id) {
            if (selectedChatType === "contact") {
                getMessages();
            } else if (selectedChatType === "channel") {
                getChannelMessages();
            }
        }
    }, [selectedChatData._id, selectedChatType, setSelectedChatMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessages]);

    const renderMessages = () => {
        console.log(selectedChatMessages);
        let lastDate = null;
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timeStamp)
                .local()
                .format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-gray-500 my-2">
                            {moment(message.timeStamp).local().format("LL")}
                        </div>
                    )}
                    {selectedChatType === "contact" && renderDMMessage(message)}
                    {selectedChatType === "channel" &&
                        renderChannelMessage(message)}
                </div>
            );
        });
    };

    const handleDownLoadFile = async (url) => {
        setIsDownLoading(true);
        setFileDownloadProgress(0);
        const response = await apiClient.get(`${HOST}/${url}`, {
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentCompleted = Math.round((loaded * 100) / total);
                setFileDownloadProgress(percentCompleted);
            },
        });
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
        setIsDownLoading(false);
        setFileDownloadProgress(0);
    };
    const renderDMMessage = (message) => {
        return (
            <div
                className={`${
                    message.sender === selectedChatData._id
                        ? "text-left"
                        : "text-right"
                }`}
            >
                {message.messageType === "text" && (
                    <div
                        className={`${
                            message.sender !== selectedChatData._id
                                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                        } 
            border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {message.content}
                    </div>
                )}
                {message.messageType === "file" && (
                    <div
                        className={`${
                            message.sender !== selectedChatData._id
                                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                        } 
        border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {checkIfImage(message.fileUrl) ? (
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    setShowImage(true);
                                    setImageURL(message.fileUrl);
                                }}
                            >
                                {
                                    <img
                                        className="size-[300px]"
                                        src={`${HOST}/${message.fileUrl}`}
                                    />
                                }
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                                    <MdFolderZip />
                                </span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                                <span
                                    onClick={() =>
                                        handleDownLoadFile(message.fileUrl)
                                    }
                                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                >
                                    <IoMdArrowRoundDown />
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div className="text-xs text-gray-600">
                    {moment(message.timeStamp).local().format("LT")}
                </div>
            </div>
        );
    };
    const renderChannelMessage = (message) => {
        return (
            <div
                className={`mt-5 ${
                    message.sender._id !== userInfo.id
                        ? "text-left"
                        : "text-right"
                }`}
            >
                {message.messageType === "text" && (
                    <div
                        className={`${
                            message.sender._id === userInfo.id
                                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                        } 
            border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
                    >
                        {message.content}
                    </div>
                )}
                {message.messageType === "file" && (
                    <div
                        className={`${
                            message.sender._id !== userInfo.id
                                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                        } 
        border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {checkIfImage(message.fileUrl) ? (
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    setShowImage(true);
                                    setImageURL(message.fileUrl);
                                }}
                            >
                                {
                                    <img
                                        className="size-[300px]"
                                        src={`${HOST}/${message.fileUrl}`}
                                    />
                                }
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                                    <MdFolderZip />
                                </span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                                <span
                                    onClick={() =>
                                        handleDownLoadFile(message.fileUrl)
                                    }
                                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                >
                                    <IoMdArrowRoundDown />
                                </span>
                            </div>
                        )}
                    </div>
                )}
                {message.sender._id !== userInfo.id ? (
                    <div className="flex items-center justify-start gap-3">
                        <Avatar className="size-8 rounded-full overflow-hidden">
                            {message.sender.image && (
                                <AvatarImage
                                    src={`${HOST}/${message.sender.image}`}
                                    alt="profile"
                                    className="object-cover size-full bg-black"
                                />
                            )}
                            <AvatarFallback
                                className={`uppercase size-8  text-lg  flex items-center justify-center rounded-full ${getColor(
                                    message.sender.color
                                )}`}
                            >
                                {message.sender.firstName
                                    ? message.sender.firstName.split("").shift()
                                    : message.sender.email.split("").shift()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
                        <span className="text-xs text-white/60">
                            {moment(message.timeStamp).local().format("LT")}
                        </span>
                    </div>
                ) : (
                    <div className="text-xs text-white/60 mt-1">
                        {moment(message.timeStamp).local().format("LT")}
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full scrollbar-hidden">
            {renderMessages()}
            <div ref={scrollRef}></div>
            {showImage && (
                <div className="fixed z-[100] top-0 h-[100vh] w-[100vw] left-0 flex justify-center items-center backdrop-blur-lg flex-col">
                    <div>
                        <img
                            src={`${HOST}/${imageURL}`}
                            className="h-[80vh] w-full bg-cover"
                        />
                    </div>
                    <div className="flex gap-5 fixed top-0 mt-5">
                        <button
                            onClick={() => handleDownLoadFile(imageURL)}
                            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        >
                            <IoMdArrowRoundDown />
                        </button>
                        <button
                            onClick={() => {
                                setShowImage(false);
                                setImageURL(null);
                            }}
                            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                        >
                            <IoCloseSharp />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageContainer;
