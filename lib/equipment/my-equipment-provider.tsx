import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserEquipment {
  id: string;
  catalogId: string | null; // Reference to catalog item, null if custom
  type: 'machine' | 'grinder';
  name: string;
  brand: string;
  image: any;
  purchaseDate: string;
  lastMaintenance: string | null;
  nextMaintenanceDue: string | null;
  favoriteBeans: string[]; // Array of bean IDs
  notes: string;
  isCustom: boolean;
}

export interface CoffeeStock {
  beanId: string;
  beanName: string;
  currentWeight: number; // in grams
  dailyConsumption: number; // average grams per day
  lastUpdated: string;
  lowStockThreshold: number; // days remaining threshold
}

interface MyEquipmentContextType {
  equipment: UserEquipment[];
  coffeeStock: CoffeeStock[];
  addEquipment: (equipment: Omit<UserEquipment, 'id'>) => Promise<void>;
  removeEquipment: (id: string) => Promise<void>;
  updateEquipment: (id: string, updates: Partial<UserEquipment>) => Promise<void>;
  addFavoriteBean: (equipmentId: string, beanId: string) => Promise<void>;
  removeFavoriteBean: (equipmentId: string, beanId: string) => Promise<void>;
  updateMaintenance: (equipmentId: string, date: string) => Promise<void>;
  getMaintenanceDueItems: () => UserEquipment[];
  addCoffeeStock: (stock: Omit<CoffeeStock, 'lastUpdated'>) => Promise<void>;
  updateCoffeeStock: (beanId: string, currentWeight: number) => Promise<void>;
  removeCoffeeStock: (beanId: string) => Promise<void>;
  getLowStockItems: () => CoffeeStock[];
  getDaysUntilEmpty: (stock: CoffeeStock) => number;
}

const MyEquipmentContext = createContext<MyEquipmentContextType | undefined>(undefined);

const STORAGE_KEY = '@coffee_craft_my_equipment';
const STOCK_STORAGE_KEY = '@coffee_craft_coffee_stock';

export function MyEquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<UserEquipment[]>([]);
  const [coffeeStock, setCoffeeStock] = useState<CoffeeStock[]>([]);

  // Load equipment from storage
  useEffect(() => {
    loadEquipment();
    loadCoffeeStock();
  }, []);

  const loadEquipment = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setEquipment(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load equipment:', error);
    }
  };

  const loadCoffeeStock = async () => {
    try {
      const data = await AsyncStorage.getItem(STOCK_STORAGE_KEY);
      if (data) {
        setCoffeeStock(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load coffee stock:', error);
    }
  };

  const saveEquipment = async (newEquipment: UserEquipment[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEquipment));
      setEquipment(newEquipment);
    } catch (error) {
      console.error('Failed to save equipment:', error);
    }
  };

  const saveCoffeeStock = async (newStock: CoffeeStock[]) => {
    try {
      await AsyncStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(newStock));
      setCoffeeStock(newStock);
    } catch (error) {
      console.error('Failed to save coffee stock:', error);
    }
  };

  const addEquipment = async (newEquipment: Omit<UserEquipment, 'id'>) => {
    const id = `equipment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const equipmentWithId: UserEquipment = { ...newEquipment, id };
    
    // Calculate next maintenance due date
    const maintenanceInterval = newEquipment.type === 'grinder' ? 90 : 180; // 3 months for grinder, 6 for machine
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + maintenanceInterval);
    equipmentWithId.nextMaintenanceDue = nextDue.toISOString();
    
    await saveEquipment([...equipment, equipmentWithId]);
  };

  const removeEquipment = async (id: string) => {
    await saveEquipment(equipment.filter(e => e.id !== id));
  };

  const updateEquipment = async (id: string, updates: Partial<UserEquipment>) => {
    await saveEquipment(
      equipment.map(e => e.id === id ? { ...e, ...updates } : e)
    );
  };

  const addFavoriteBean = async (equipmentId: string, beanId: string) => {
    const item = equipment.find(e => e.id === equipmentId);
    if (!item) return;
    
    if (!item.favoriteBeans.includes(beanId)) {
      await updateEquipment(equipmentId, {
        favoriteBeans: [...item.favoriteBeans, beanId],
      });
    }
  };

  const removeFavoriteBean = async (equipmentId: string, beanId: string) => {
    const item = equipment.find(e => e.id === equipmentId);
    if (!item) return;
    
    await updateEquipment(equipmentId, {
      favoriteBeans: item.favoriteBeans.filter(id => id !== beanId),
    });
  };

  const updateMaintenance = async (equipmentId: string, date: string) => {
    const item = equipment.find(e => e.id === equipmentId);
    if (!item) return;
    
    const maintenanceInterval = item.type === 'grinder' ? 90 : 180;
    const nextDue = new Date(date);
    nextDue.setDate(nextDue.getDate() + maintenanceInterval);
    
    await updateEquipment(equipmentId, {
      lastMaintenance: date,
      nextMaintenanceDue: nextDue.toISOString(),
    });
  };

  const getMaintenanceDueItems = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return equipment.filter(item => {
      if (!item.nextMaintenanceDue) return false;
      const dueDate = new Date(item.nextMaintenanceDue);
      return dueDate <= sevenDaysFromNow;
    });
  };

  const addCoffeeStock = async (stock: Omit<CoffeeStock, 'lastUpdated'>) => {
    const newStock: CoffeeStock = {
      ...stock,
      lastUpdated: new Date().toISOString(),
    };
    await saveCoffeeStock([...coffeeStock, newStock]);
  };

  const updateCoffeeStock = async (beanId: string, currentWeight: number) => {
    await saveCoffeeStock(
      coffeeStock.map(s => 
        s.beanId === beanId 
          ? { ...s, currentWeight, lastUpdated: new Date().toISOString() }
          : s
      )
    );
  };

  const removeCoffeeStock = async (beanId: string) => {
    await saveCoffeeStock(coffeeStock.filter(s => s.beanId !== beanId));
  };

  const getDaysUntilEmpty = (stock: CoffeeStock) => {
    if (stock.dailyConsumption <= 0) return Infinity;
    return Math.floor(stock.currentWeight / stock.dailyConsumption);
  };

  const getLowStockItems = () => {
    return coffeeStock.filter(stock => {
      const daysRemaining = getDaysUntilEmpty(stock);
      return daysRemaining <= stock.lowStockThreshold;
    });
  };

  return (
    <MyEquipmentContext.Provider
      value={{
        equipment,
        coffeeStock,
        addEquipment,
        removeEquipment,
        updateEquipment,
        addFavoriteBean,
        removeFavoriteBean,
        updateMaintenance,
        getMaintenanceDueItems,
        addCoffeeStock,
        updateCoffeeStock,
        removeCoffeeStock,
        getLowStockItems,
        getDaysUntilEmpty,
      }}
    >
      {children}
    </MyEquipmentContext.Provider>
  );
}

export function useMyEquipment() {
  const context = useContext(MyEquipmentContext);
  if (!context) {
    throw new Error('useMyEquipment must be used within MyEquipmentProvider');
  }
  return context;
}
