import { createContext, useContext, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface RestRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, unknown> | null;
  headers?: Record<string, string>;
}

interface ManagerContextType {
  makeRequest: (request: RestRequest) => Promise<void>;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

const queueKey = "restRequestQueue";

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const makeRequest = async (request: RestRequest) => {
    try {
      const queue = await AsyncStorage.getItem(queueKey);
      const parsedQueue: RestRequest[] = queue ? JSON.parse(queue) : [];
      parsedQueue.push(request);
      await AsyncStorage.setItem(queueKey, JSON.stringify(parsedQueue));
    } catch (error) {
      console.error("Error adding request to queue:", error);
    }
  };

  const processQueue = async () => {
    try {
      const queue = await AsyncStorage.getItem(queueKey);
      if (!queue) return;

      const parsedQueue: RestRequest[] = JSON.parse(queue);

      for (const request of parsedQueue) {
        try {
          await axios({
            url: request.url,
            method: request.method,
            data: request.data,
            headers: request.headers,
          });
        } catch (error) {
          console.error("Failed to process request:", error);
        }
      }

      await AsyncStorage.removeItem(queueKey);
    } catch (error) {
      console.error("Error processing request queue:", error);
    }
  };

  return (
    <ManagerContext.Provider value={{ makeRequest: makeRequest }}>
      {children}
    </ManagerContext.Provider>
  );
};

export const useManager = (): ManagerContextType => {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error("useManager must be used within a ManagerProvider");
  }
  return context;
};
