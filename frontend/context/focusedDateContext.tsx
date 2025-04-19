import { DateStruct } from "@/utils/dateTimeSession";
import React, { createContext, useContext, useState } from "react";

type FocusedDateContextType = {
  focusedDate: DateStruct;
  setFocusedDate: (date: DateStruct) => void;
};

const FocusedDateContext = createContext<FocusedDateContextType | undefined>(
  undefined,
);

export function FocusedDateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [focusedDate, setFocusedDate] = useState(
    DateStruct.fromDate(new Date()),
  );

  return (
    <FocusedDateContext.Provider value={{ focusedDate, setFocusedDate }}>
      {children}
    </FocusedDateContext.Provider>
  );
}

export function useFocusedDate() {
  const context = useContext(FocusedDateContext);
  if (!context) {
    throw new Error("useFocusedDate must be used within a FocusedDateProvider");
  }
  return context;
}
