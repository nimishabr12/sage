/**
 * Calculate XP earned for a focus session
 * @param durationMinutes - Session duration (25 or 50 minutes)
 * @param wasCompleted - Whether the session was completed
 * @returns XP earned
 */
export function calculateSessionXP(
  durationMinutes: 25 | 50,
  wasCompleted: boolean
): number {
  if (!wasCompleted) return 0

  // Base XP: 10 XP per 25 minutes, 20 XP per 50 minutes
  return durationMinutes === 25 ? 10 : 20
}

/**
 * Calculate level from total XP (100 XP per level)
 * @param totalXP - Total XP accumulated
 * @returns Current level
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1
}

/**
 * Calculate XP needed for next level
 * @param currentLevel - Current user level
 * @returns XP needed for next level
 */
export function xpForNextLevel(currentLevel: number): number {
  return currentLevel * 100
}

/**
 * Calculate progress percentage to next level
 * @param totalXP - Total XP accumulated
 * @returns Progress percentage (0-100)
 */
export function levelProgress(totalXP: number): number {
  const currentLevelXP = totalXP % 100
  return currentLevelXP
}
