import { useStore } from "./useStore"
import { useGamificationStore, GamificationState } from "@/store/useGamificationStore"

export const useGamificationStoreSafe = <F>(selector: (state: GamificationState) => F): F | undefined => {
  return useStore(useGamificationStore, selector)
}
