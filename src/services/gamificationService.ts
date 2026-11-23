import confetti from 'canvas-confetti';
import { soundService } from './soundService';

export interface RankDefinition {
  name: string;
  minXp: number;
  maxXp: number;
  badgeColor: string;
  badgeBg: string;
  iconName: string;
}

export const RANKS: RankDefinition[] = [
  { name: 'Rookie', minXp: 0, maxXp: 150, badgeColor: 'text-emerald-700', badgeBg: 'bg-emerald-100', iconName: 'Seedling' },
  { name: 'Explorer', minXp: 151, maxXp: 400, badgeColor: 'text-sky-700', badgeBg: 'bg-sky-100', iconName: 'Compass' },
  { name: 'Challenger', minXp: 401, maxXp: 800, badgeColor: 'text-blue-700', badgeBg: 'bg-blue-100', iconName: 'Flame' },
  { name: 'Speaker', minXp: 801, maxXp: 1500, badgeColor: 'text-indigo-700', badgeBg: 'bg-indigo-100', iconName: 'Mic' },
  { name: 'Fluent Performer', minXp: 1501, maxXp: 2800, badgeColor: 'text-purple-700', badgeBg: 'bg-purple-100', iconName: 'Award' },
  { name: 'Arena Champion', minXp: 2801, maxXp: 10000, badgeColor: 'text-amber-700', badgeBg: 'bg-amber-100', iconName: 'Crown' }
];

export function getRankByXp(xp: number): RankDefinition {
  const rank = RANKS.find(r => xp >= r.minXp && xp <= r.maxXp);
  return rank || RANKS[RANKS.length - 1];
}

export function getNextRankProgress(xp: number): { currentRank: RankDefinition; nextRank: RankDefinition | null; progressPercent: number; xpNeeded: number } {
  const currentRank = getRankByXp(xp);
  const currentIndex = RANKS.findIndex(r => r.name === currentRank.name);
  const nextRank = currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      progressPercent: 100,
      xpNeeded: 0
    };
  }

  const span = nextRank.minXp - currentRank.minXp;
  const currentInSpan = Math.max(0, xp - currentRank.minXp);
  const progressPercent = Math.min(100, Math.round((currentInSpan / span) * 100));
  const xpNeeded = Math.max(0, nextRank.minXp - xp);

  return {
    currentRank,
    nextRank,
    progressPercent,
    xpNeeded
  };
}

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 }
  });
}

export function triggerVictoryConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function celebrateReward(isLevelUp: boolean = false) {
  if (isLevelUp) {
    soundService.playLevelUp();
    triggerVictoryConfetti();
  } else {
    soundService.playSuccess();
    triggerConfetti();
  }
}
