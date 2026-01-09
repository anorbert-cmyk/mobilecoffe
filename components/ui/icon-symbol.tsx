// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings
 * iOS 26 inspired icon set for Coffee Craft
 */
const MAPPING = {
  // Tab bar icons
  "house.fill": "home",
  "cup.and.saucer.fill": "coffee",
  "location.fill": "location-on",
  "book.fill": "menu-book",
  "gearshape.fill": "settings",
  
  // Navigation
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "chevron.down": "expand-more",
  "chevron.up": "expand-less",
  "xmark": "close",
  "arrow.left": "arrow-back",
  
  // Actions
  "paperplane.fill": "send",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "star.fill": "star",
  "star": "star-border",
  "plus": "add",
  "minus": "remove",
  "magnifyingglass": "search",
  "slider.horizontal.3": "tune",
  
  // Coffee related
  "timer": "timer",
  "flame.fill": "local-fire-department",
  "drop.fill": "water-drop",
  "thermometer": "thermostat",
  
  // Machine settings
  "wrench.fill": "build",
  "gauge": "speed",
  "dial.low.fill": "tune",
  
  // Info
  "info.circle.fill": "info",
  "exclamationmark.triangle.fill": "warning",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "checkmark": "check",
  
  // Equipment
  "arrow.down.circle.fill": "download",
  "lightbulb.fill": "lightbulb",
  "list.bullet": "list",
  
  // Misc
  "map.fill": "map",
  "phone.fill": "phone",
  "globe": "language",
  "clock.fill": "schedule",
  
  // Theme/Appearance
  "sun.max.fill": "light-mode",
  "moon.fill": "dark-mode",
  "circle.lefthalf.filled": "contrast",
  "paintbrush.fill": "brush",
  
  // Profile
  "person.fill": "person",
  "gearshape.2.fill": "settings",
  "dollarsign.circle.fill": "attach-money",
  "sparkles": "auto-awesome",
  "arrow.counterclockwise": "refresh",
} as IconMapping;

/**
 * Icon component using native SF Symbols on iOS, Material Icons elsewhere
 * Consistent look across platforms with optimal resource usage
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || "help-outline";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
