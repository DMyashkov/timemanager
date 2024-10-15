// timemanager/utils/iconLoader.ts
import { SvgUri } from "react-native-svg";

// Utility function to load an icon by name
export const loadIcon = (iconName: string) => {
  // Define the path for your icons in the assets folder
  const iconPath = `@assets/icons/${iconName}.svg`;

  // Return the SVG icon wrapped in SvgUri (if using react-native-svg)
  return <SvgUri uri={iconPath} width={24} height={24} />;
};
