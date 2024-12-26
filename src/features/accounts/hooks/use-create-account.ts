import { create } from "zustand";

type CreateAccountState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCreateAccount = create<CreateAccountState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
