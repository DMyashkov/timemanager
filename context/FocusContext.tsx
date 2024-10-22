import { createContext, useContext, useState } from "react";

interface FocusContextType {
  focusedLevel: number;
  setFocusedLevel: (level: number) => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

interface FocusProviderProps {
  children: React.ReactNode;
}

export const FocusProvider: React.FC<FocusProviderProps> = ({ children }) => {
  const [focusedLevel, setFocusedLevel] = useState<number>(0);

  return (
    <FocusContext.Provider value={{ focusedLevel, setFocusedLevel }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = (): FocusContextType => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error("useFocus must be used within a FocusProvider");
  }
  return context;
};
