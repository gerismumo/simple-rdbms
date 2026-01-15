import { create } from "zustand";

//@ts-ignore
interface AppState {
  currentDatabase: string | null;
  setCurrentDatabase: (database: string | null) => void;

  // Loading states
  loading: {
    query: boolean;
  };
  setLoading: (key: keyof AppState["loading"], value: boolean) => void;

  sidebarOpened: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentDatabase: null,
  setCurrentDatabase: (database) => set({ currentDatabase: database }),

  loading: {
    query: false,
  },
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),

  sidebarOpened: true,
  toggleSidebar: () =>
    set((state) => ({ sidebarOpened: !state.sidebarOpened })),
}));
