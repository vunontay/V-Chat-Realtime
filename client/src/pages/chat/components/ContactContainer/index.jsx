import ContactList from "@/components/ContactList";
import { apiClient } from "@/lib/api-client";
import CreateChanel from "@/pages/chat/components/ContactContainer/components/CreateChanel";
import NewDm from "@/pages/chat/components/ContactContainer/components/NewDm";
import ProfileInfo from "@/pages/chat/components/ContactContainer/components/ProfileInfo";
import { useAppStore } from "@/store";
import {
    GET_DM_CONTACTS_ROUTES,
    GET_USER_CHANNEL_ROUTES,
} from "@/utils/constant";
import { useEffect } from "react";
import Logo from "@/assets/logo.png";

const ContactContainer = () => {
    const {
        directMessageContacts,
        setDirectMessageContacts,
        channels,
        setChannel,
    } = useAppStore();
    useEffect(() => {
        const getContacts = async () => {
            const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
                withCredentials: true,
            });
            if (response.data.contacts) {
                setDirectMessageContacts(response.data.contacts);
            }
        };
        const getChannels = async () => {
            const response = await apiClient.get(GET_USER_CHANNEL_ROUTES, {
                withCredentials: true,
            });
            if (response.data.channels) {
                setChannel(response.data.channels);
            }
        };
        getContacts();
        getChannels();
    }, [setChannel, setDirectMessageContacts]);

    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            <div className="pt-3 flex justify-start items-center gap-2 pl-10">
                <span className="text-xl font-medium text-white/80">
                    V-Chat
                </span>
                <img
                    alt="logo"
                    src={Logo}
                    className="max-w-[100px] max-h-[40px]"
                />
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text={"Direct Messages"} />
                    <NewDm />
                </div>
                <div className="max-h[38vh] overflow-y-auto scrollbar-hidden">
                    <ContactList contacts={directMessageContacts} />
                </div>
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text={"Channels"} />
                    <CreateChanel />
                </div>
                <div className="max-h[38vh] overflow-y-auto scrollbar-hidden">
                    <ContactList contacts={channels} isChannel={true} />
                </div>
            </div>
            <ProfileInfo />
        </div>
    );
};

export default ContactContainer;

const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-medium text-opacity-90 text-sm">
            {text}
        </h6>
    );
};
