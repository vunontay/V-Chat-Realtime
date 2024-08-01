import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
    CREATE_CHANNEL_ROUTE,
    GET_ALL_CONTACTS_ROUTES,
} from "@/utils/constant";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChanel = () => {
    const { setSelectedChatType, setSelectedChatData, addChannel } =
        useAppStore();
    const [openNewChanelModal, setOpenNewChanelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [chanelName, setChanelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
                withCredentials: true,
            });
            setAllContacts(response.data.contacts);
        };
        getData();
    }, []);

    const createChanel = async () => {
        try {
            if (chanelName.length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(
                    CREATE_CHANNEL_ROUTE,
                    {
                        name: chanelName,
                        members: selectedContacts.map(
                            (contact) => contact.value
                        ),
                    },
                    { withCredentials: true }
                );

                if (response.status === 201) {
                    setChanelName("");
                    setSelectedContacts([]);
                    setOpenNewChanelModal(false);
                    addChannel(response.data.channel);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewChanelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Create New Chanel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog
                open={openNewChanelModal}
                onOpenChange={setOpenNewChanelModal}
            >
                <DialogContent className="bg-[#181920] border-none text-white size-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            Please fill up the details for new chanel.
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Chanel Name"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => setChanelName(e.target.value)}
                            value={chanelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">
                                    Result not found.
                                </p>
                            }
                            onChange={setSelectedContacts}
                            placeholder={"Search contacts"}
                            value={selectedContacts}
                            defaultOptions={allContacts}
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                        />
                    </div>
                    <div>
                        <Button
                            onClick={createChanel}
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                        >
                            Create Chanel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateChanel;
