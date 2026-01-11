import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoriteItem = { id: string; type: 'coffee' | 'machine' | 'grinder' | 'bean' | 'article'; addedAt: string };

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (id: string, type: FavoriteItem['type']) => void;
  isFavorite: (id: string) => boolean;
  getFavoritesByType: (type: FavoriteItem['type']) => FavoriteItem[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const STORAGE_KEY = '@coffee_craft_favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  const saveFavorites = async (newFavorites: FavoriteItem[]) => {
    setFavorites(newFavorites);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  };

  const toggleFavorite = (id: string, type: FavoriteItem['type']) => {
    const exists = favorites.find(f => f.id === id);
    if (exists) {
      saveFavorites(favorites.filter(f => f.id !== id));
    } else {
      saveFavorites([...favorites, { id, type, addedAt: new Date().toISOString() }]);
    }
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);
  const getFavoritesByType = (type: FavoriteItem['type']) => favorites.filter(f => f.type === type);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, getFavoritesByType }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
