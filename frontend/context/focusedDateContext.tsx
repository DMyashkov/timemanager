import { DateStruct, Time } from "@/utils/dateTimeSession";
import React, { createContext, useContext, useState } from "react";

type FocusedDateContextType = {
  focusedDate: DateStruct;
  setFocusedDate: (date: DateStruct) => void;
  productiveTime: Time;
  setProductiveTime: (time: Time) => void;
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
  const [productiveTime, setProductiveTime] = useState(new Time(0, 0, 0));

  return (
    <FocusedDateContext.Provider
      value={{ focusedDate, setFocusedDate, productiveTime, setProductiveTime }}
    >
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
