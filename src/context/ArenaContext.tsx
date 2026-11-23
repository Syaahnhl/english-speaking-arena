import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ProficiencyLevel, UserRole, SpeakingCartItem, DailyChallenge } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';
import { celebrateReward } from '../services/gamificationService';

export interface ToastMessage {
  id: string;
  type: 'xp' | 'success' | 'achievement' | 'info';
  title: string;
  message: string;
  xpAmount?: number;
}

interface ArenaContextType {
  user: UserProfile;
  role: UserRole;
  level: ProficiencyLevel;
  cart: SpeakingCartItem[];
  cartDurationMinutes: number;
  dailyChallenges: DailyChallenge[];
  soundEnabled: boolean;
  toasts: ToastMessage[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setLevel: (level: ProficiencyLevel) => void;
  setRole: (role: UserRole) => void;
  toggleSound: () => void;
  addToCart: (item: SpeakingCartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  awardXp: (amount: number, reason: string) => void;
  completeDailyChallenge: (id: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
  refreshState: () => void;
}

const ArenaContext = createContext<ArenaContextType | undefined>(undefined);

export const ArenaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(storageService.getCurrentUser());
  const [role, setRoleState] = useState<UserRole>(storageService.getCurrentRole());
  const [level, setLevelState] = useState<ProficiencyLevel>(user.level);
  const [cart, setCart] = useState<SpeakingCartItem[]>(storageService.getCartItems());
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(storageService.getDailyChallenges());
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const refreshState = () => {
    const updatedUser = storageService.getCurrentUser();
    setUser(updatedUser);
    setLevelState(updatedUser.level);
    setRoleState(storageService.getCurrentRole());
    setCart(storageService.getCartItems());
    setDailyChallenges(storageService.getDailyChallenges());
  };

  useEffect(() => {
    refreshState();
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setLevel = (newLevel: ProficiencyLevel) => {
    const updated = storageService.updateLevel(newLevel);
    setUser(updated);
    setLevelState(newLevel);
    soundService.playClick();
    addToast({
      type: 'info',
      title: 'Proficiency Level Updated',
      message: `Switched arena curriculum focus to ${newLevel.toUpperCase()} mode.`
    });
  };

  const setRole = (newRole: UserRole) => {
    storageService.switchRole(newRole);
    setRoleState(newRole);
    const updatedUser = storageService.getCurrentUser();
    setUser(updatedUser);
    setLevelState(updatedUser.level);
    soundService.playClick();
    addToast({
      type: 'info',
      title: `Switched to ${newRole === 'teacher' ? 'Teacher / Admin' : 'Student'} Mode`,
      message: newRole === 'teacher' ? 'Accessing classroom grading, materials, and challenge creators.' : 'Entering student speaking and learning arena.'
    });
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    soundService.setSoundEnabled(next);
    if (next) soundService.playClick();
  };

  const addToCart = (item: SpeakingCartItem) => {
    storageService.addToCart(item);
    setCart(storageService.getCartItems());
    soundService.playClick();
    addToast({
      type: 'success',
      title: 'Added to Speaking Cart',
      message: `"${item.title}" added to your custom practice menu.`
    });
  };

  const removeFromCart = (id: string) => {
    storageService.removeFromCart(id);
    setCart(storageService.getCartItems());
    soundService.playClick();
  };

  const clearCart = () => {
    storageService.clearCart();
    setCart([]);
    soundService.playClick();
  };

  const awardXp = (amount: number, reason: string) => {
    const result = storageService.addXp(amount, reason);
    setUser(storageService.getCurrentUser());
    celebrateReward(result.leveledUp);

    addToast({
      type: result.leveledUp ? 'achievement' : 'xp',
      title: result.leveledUp ? '🎉 Rank Level Up!' : 'XP Earned!',
      message: `${reason} (+${amount} XP)`,
      xpAmount: amount
    });

    if (result.unlockedAchievements.length > 0) {
      result.unlockedAchievements.forEach(achName => {
        setTimeout(() => {
          addToast({
            type: 'achievement',
            title: '🏆 Achievement Unlocked!',
            message: `You earned the "${achName}" badge!`
          });
        }, 800);
      });
    }
  };

  const completeDailyChallenge = (id: string) => {
    const xp = storageService.completeDailyChallenge(id);
    if (xp > 0) {
      refreshState();
      celebrateReward(false);
      addToast({
        type: 'xp',
        title: 'Daily Challenge Completed!',
        message: `Awesome consistency! +${xp} XP`,
        xpAmount: xp
      });
    }
  };

  const resetAllData = () => {
    storageService.resetToFactory();
    refreshState();
    soundService.playSuccess();
    addToast({
      type: 'info',
      title: 'Reset Completed',
      message: 'Demo dataset restored to initial state.'
    });
  };

  const cartDurationMinutes = Math.round(cart.reduce((sum, item) => sum + item.duration, 0) / 60);

  return (
    <ArenaContext.Provider
      value={{
        user,
        role,
        level,
        cart,
        cartDurationMinutes,
        dailyChallenges,
        soundEnabled,
        toasts,
        activeTab,
        setActiveTab,
        setLevel,
        setRole,
        toggleSound,
        addToCart,
        removeFromCart,
        clearCart,
        awardXp,
        completeDailyChallenge,
        addToast,
        removeToast,
        resetAllData,
        refreshState
      }}
    >
      {children}
    </ArenaContext.Provider>
  );
};

export const useArena = () => {
  const context = useContext(ArenaContext);
  if (!context) {
    throw new Error('useArena must be used within an ArenaProvider');
  }
  return context;
};
