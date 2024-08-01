import { createAuthSlice } from "@/store/slices/auth-slice";
import { createChatSlice } from "@/store/slices/chat-slice";
import { create } from "zustand";

export const useAppStore = create()((...args) => ({
    ...createAuthSlice(...args),
    ...createChatSlice(...args),
}));
