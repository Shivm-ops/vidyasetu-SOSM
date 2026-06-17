import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GrowthLevel = 'Beginner' | 'Growing' | 'Strong Learner' | 'Future Leader' | 'Champion';

export interface GamificationState {
  // 5 Pillars of Growth
  learningXP: number;
  skillXP: number;
  careerXP: number;
  innovationXP: number;
  communityXP: number;

  streak: number;
  lastActiveDate: string | null;
  badges: string[];
  
  // Actions
  addXP: (pillar: 'learning' | 'skill' | 'career' | 'innovation' | 'community', amount: number) => void;
  updateStreak: () => void;
  unlockBadge: (badge: string) => void;
  
  // Computed (getters)
  getTotalXP: () => number;
  getGrowthLevel: () => GrowthLevel;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      learningXP: 0,
      skillXP: 0,
      careerXP: 0,
      innovationXP: 0,
      communityXP: 0,
      streak: 0,
      lastActiveDate: null,
      badges: [],

      addXP: (pillar, amount) => set((state) => ({
        [`${pillar}XP`]: state[`${pillar}XP` as keyof GamificationState] as number + amount
      })),
      
      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        
        if (state.lastActiveDate === today) return; // Already active today

        if (!state.lastActiveDate) {
          set({ streak: 1, lastActiveDate: today });
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (state.lastActiveDate === yesterdayStr) {
          set({ streak: state.streak + 1, lastActiveDate: today });
        } else {
          set({ streak: 1, lastActiveDate: today }); // Broken streak
        }
      },

      unlockBadge: (badge) => set((state) => ({
        badges: state.badges.includes(badge) ? state.badges : [...state.badges, badge]
      })),

      getTotalXP: () => {
        const s = get();
        return s.learningXP + s.skillXP + s.careerXP + s.innovationXP + s.communityXP;
      },

      getGrowthLevel: () => {
        const total = get().getTotalXP();
        if (total < 500) return 'Beginner';
        if (total < 2000) return 'Growing';
        if (total < 5000) return 'Strong Learner';
        if (total < 10000) return 'Future Leader';
        return 'Champion';
      }
    }),
    {
      name: 'vidyasetu-growth-engine',
    }
  )
);
