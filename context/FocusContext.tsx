import { createContext, useContext, useState } from "react";

interface FocusContextType {
  focusedPath: string;
  setFocusedPath: (path: string) => void;
  popFocusStack: () => void;
  focusedLevel: number;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

interface FocusProviderProps {
  children: React.ReactNode;
}

export const FocusProvider: React.FC<FocusProviderProps> = ({ children }) => {
  const [focusedPath, setFocusedPath] = useState<string>("/root");
  const [focusStack, setFocusStack] = useState<string[]>([]);
  const [focusedLevel, setFocusedLevel] = useState<number>(0);
  const setLevel = (path: string) => {
    setFocusedLevel(path.split("/").length - 1);
  };
  const setPath = (path: string) => {
    setFocusedPath(path);
    setLevel(path);
    setFocusStack([...focusStack, focusedPath]);
  };
  const popFocusStack = () => {
    const lastPath = focusStack.pop();
    if (lastPath) {
      setFocusedPath(lastPath);
      setLevel(lastPath);
    }
  };

  return (
    <FocusContext.Provider
      value={{
        focusedPath,
        setFocusedPath: setPath,
        popFocusStack,
        focusedLevel,
      }}
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
