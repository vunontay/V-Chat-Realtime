import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constant";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore();

    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
            <div className="flex gap-5 items-center w-full justify-between">
                <div className="flex gap-3 items-center">
                    {selectedChatType === "contact" ? (
                        <div className="size-12 relative rounded-full overflow-hidden">
                            <Avatar className="size-12 rounded-full overflow-hidden">
                                {selectedChatData.image ? (
                                    <AvatarImage
                                        src={`${HOST}/${selectedChatData.image}`}
                                        alt="profile"
                                        className="object-cover size-full bg-black"
                                    />
                                ) : (
                                    <div
                                        className={`uppercase size-12 text-lg border flex items-center justify-center rounded-full ${getColor(
                                            selectedChatData.color
                                        )}`}
                                    >
                                        {selectedChatData.firstName
                                            ? selectedChatData.firstName.charAt(
                                                  0
                                              )
                                            : selectedChatData.email.charAt(0)}
                                    </div>
                                )}
                            </Avatar>
                        </div>
                    ) : (
                        <div className="bg-[#ffffff22] size-10 flex items-center justify-center rounded-full">
                            #
                        </div>
                    )}

                    <div>
                        {selectedChatType === "channel" &&
                            selectedChatData.name}
                        {selectedChatType === "contact" &&
                        selectedChatData.firstName
                            ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                            : selectedChatData.email}
                    </div>
                </div>
                <div className="flex items-center justify-center gap-5">
                    <button
                        onClick={closeChat}
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    >
                        <RiCloseFill className="text-3xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
