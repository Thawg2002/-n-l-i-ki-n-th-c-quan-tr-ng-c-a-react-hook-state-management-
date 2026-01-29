import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  login: (name) => set({ user: { name } }),
  logout: () => set({ user: null }),
  updateName: (name) => set((state) => ({ user: { ...state.user, name } })),
}));
