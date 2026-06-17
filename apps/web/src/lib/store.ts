import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudentInfo {
  id: string;
  grade: number;
  stage: string;
  studentId: string;
}

interface UserInfo {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  firstNameMarathi?: string;
  profilePhotoUrl?: string;
  preferredLanguage: string;
  schoolId?: string;
  student?: StudentInfo;
  teacher?: { id: string; employeeId: string };
  parent?: { id: string };
}

interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserInfo) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: "vidyasetu-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// UI preferences store
interface UIState {
  language: "mr" | "en" | "hi";
  isOffline: boolean;
  setLanguage: (lang: "mr" | "en" | "hi") => void;
  setOffline: (offline: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: "mr",
      isOffline: false,
      setLanguage: (language) => set({ language }),
      setOffline: (isOffline) => set({ isOffline }),
    }),
    { name: "vidyasetu-ui" }
  )
);
