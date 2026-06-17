import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// -----------------------------------------------------------------------------
// Intelligence Store Types
// -----------------------------------------------------------------------------

interface RecoveryPlan {
  weakConcepts: string[];
  strongConcepts: string[];
  missions: string[];
}

interface CareerMatch {
  career: string;
  matchScore: number;
  reason: string;
}

interface VillageImpact {
  impactLevel: 'PARTICIPANT' | 'CONTRIBUTOR' | 'LEADER';
  totalImpactScore: number;
  missionsCompleted: number;
}

interface IntelligenceState {
  // Module 1: Adaptive Learning
  recoveryPlan: RecoveryPlan | null;
  
  // Module 2: AI Learning Brain
  dailyBriefing: string | null;
  focusArea: string | null;
  
  // Module 3 & 4: Career Engine & Dream Board
  careerMatches: CareerMatch[];
  dreamCareer: string | null;
  
  // Module 7: Village Impact Tracker
  villageImpact: VillageImpact;

  // Actions
  setRecoveryPlan: (plan: RecoveryPlan) => void;
  setDailyBriefing: (briefing: string, focusArea: string) => void;
  setCareerMatches: (matches: CareerMatch[]) => void;
  setDreamCareer: (career: string) => void;
  updateVillageImpact: (score: number) => void;
}

// -----------------------------------------------------------------------------
// Intelligence Store Implementation
// Note: This sits parallel to useGamificationStore, handling AI data models.
// -----------------------------------------------------------------------------

export const useIntelligenceStore = create<IntelligenceState>()(
  persist(
    (set, get) => ({
      recoveryPlan: null,
      dailyBriefing: null,
      focusArea: null,
      careerMatches: [],
      dreamCareer: null,
      villageImpact: {
        impactLevel: 'PARTICIPANT',
        totalImpactScore: 0,
        missionsCompleted: 0
      },

      setRecoveryPlan: (plan) => set({ recoveryPlan: plan }),
      
      setDailyBriefing: (briefing, focusArea) => set({ 
        dailyBriefing: briefing,
        focusArea: focusArea 
      }),
      
      setCareerMatches: (matches) => set({ careerMatches: matches }),
      
      setDreamCareer: (career) => set({ dreamCareer: career }),
      
      updateVillageImpact: (score) => set((state) => {
        const newScore = state.villageImpact.totalImpactScore + score;
        let newLevel = state.villageImpact.impactLevel;
        
        if (newScore > 500) newLevel = 'LEADER';
        else if (newScore > 100) newLevel = 'CONTRIBUTOR';

        return {
          villageImpact: {
            totalImpactScore: newScore,
            missionsCompleted: state.villageImpact.missionsCompleted + 1,
            impactLevel: newLevel
          }
        };
      })
    }),
    {
      name: 'vidyasetu-intelligence-engine',
    }
  )
);
