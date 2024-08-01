import ChatContainer from "@/pages/chat/components/ChatContainer";
import ContactContainer from "@/pages/chat/components/ContactContainer";
import EmptyChatContainer from "@/pages/chat/components/EmptyContainer";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
    const {
        userInfo,
        selectedChatType,
        isUploading,
        isDownLoading,
        fileUploadProgress,
        fileDownLoadProgress,
    } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("Please setup profile to continue.");
            navigate("/profile");
        }
    }, [navigate, userInfo.profileSetup]);

    return (
        <div className="flex h-[100vh] text-white overflow-hidden">
            {isUploading && (
                <div className="h-[100vh] w-[100vw] fixed top-0 left-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
                    <h5 className="text-5xl animate-pulse">Uploading File</h5>
                    {fileUploadProgress}%
                </div>
            )}
            {isDownLoading && (
                <div className="h-[100vh] w-[100vw] fixed top-0 left-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
                    <h5 className="text-5xl animate-pulse">Downloading File</h5>
                    {fileDownLoadProgress}%
                </div>
            )}
            <ContactContainer />
            {selectedChatType === undefined ? (
                <EmptyChatContainer />
            ) : (
                <ChatContainer />
            )}
        </div>
    );
};

export default Chat;
