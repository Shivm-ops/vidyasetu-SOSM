import { create } from "zustand";

interface AuthState {
  user: {
    teacher: {
      id: string;
    }
  } | null;
}

export const useAuthStore = create<AuthState>(() => ({
  user: {
    teacher: {
      id: "teacher-1"
    }
  }
}));
