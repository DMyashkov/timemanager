import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Global callback registry
const callbackMap = new Map<string, (value: unknown) => void>();

export const registerCallback = (id: string, fn: (value: unknown) => void) => {
  callbackMap.set(id, fn);
};

export const invokeCallback = (id: string, value: unknown) => {
  const fn = callbackMap.get(id);
  if (fn) {
    fn(value);
    callbackMap.delete(id);
  }
};

export const unregisterCallback = (id: string) => {
  callbackMap.delete(id);
};

export const useCallbackRegistry = () => {
  // Generate a stable callback ID for this instance
  const callbackId = uuidv4();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unregisterCallback(callbackId);
    };
  }, [callbackId]);

  const registerCallbackFn = (fn: (value: unknown) => void) => {
    registerCallback(callbackId, fn);
    return callbackId;
  };

  return {
    callbackId,
    registerCallbackFn,
    invokeCallback,
  };
}; 