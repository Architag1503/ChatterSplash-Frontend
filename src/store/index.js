import { create } from "zustand"
import { createAuthSlice } from "./slices/auth_slice"
import { createChatSlice } from "./slices/chat_slice";
const useAppStore = create((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}));

export { useAppStore }