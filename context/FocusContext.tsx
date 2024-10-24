import { createContext, useContext, useState } from "react";

interface FocusContextType {
  focusedPath: string;
  setFocusedPath: (path: string) => void;
  popFocusStack: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

interface FocusProviderProps {
  children: React.ReactNode;
}

export const FocusProvider: React.FC<FocusProviderProps> = ({ children }) => {
  // const [focusedLevel, setFocusedLevel] = useState<number>(0);
  const [focusedPath, setFocusedPath] = useState<string>("/root");
  const [focusStack, setFocusStack] = useState<string[]>([]);
  const setPath = (path: string) => {
    setFocusedPath(path);
    setFocusStack([...focusStack, focusedPath]);
  };
  const popFocusStack = () => {
    const lastPath = focusStack.pop();
    if (lastPath) {
      setFocusedPath(lastPath);
    }
  };

  return (
    <FocusContext.Provider
      value={{ focusedPath, setFocusedPath: setPath, popFocusStack }}
    >
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
