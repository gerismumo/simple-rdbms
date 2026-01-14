import { create } from 'zustand';
import { Database, Table } from '../types/api';

//@ts-ignore
interface AppState {
  currentDatabase: string | null;
  setCurrentDatabase: (database: string | null) => void;

  // Databases
  databases: Database[];
  setDatabases: (databases: Database[]) => void;

  // Tables
  tables: Table[];
  setTables: (tables: Table[]) => void;

  // Loading states
  loading: {
    databases: boolean;
    tables: boolean;
    query: boolean;
  };
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;

  // Sidebar
  sidebarOpened: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentDatabase: null,
  setCurrentDatabase: (database) => set({ currentDatabase: database }),


  databases: [],
  setDatabases: (databases) => set({ databases }),


  tables: [],
  setTables: (tables) => set({ tables }),


  loading: {
    databases: false,
    tables: false,
    query: false,
  },
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),


  sidebarOpened: true,
  toggleSidebar: () => set((state) => ({ sidebarOpened: !state.sidebarOpened })),
}));