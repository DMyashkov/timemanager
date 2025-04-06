import { useCallback } from "react";
import { router } from "expo-router";
import { useCallbackRegistry } from "./useCallbackRegistry";

interface NavigateToAddOptions {
  parentId?: number;
  isAddScreen?: boolean;
  onDelete?: (result: unknown) => void;
}

export const useNavigationCallback = () => {
  const { callbackId, registerCallbackFn } = useCallbackRegistry();

  const navigateToAdd = useCallback(
    ({
      parentId,
      isAddScreen = true,
      onDelete: onResult,
    }: NavigateToAddOptions) => {
      if (onResult) {
        registerCallbackFn(onResult);
      }

      router.push({
        pathname: "/add",
        params: {
          ...(parentId && { parentId: parentId.toString() }),
          ...(isAddScreen && { rawIsAddScreen: "true" }),
          ...(callbackId && { callbackId }),
        },
      });
    },
    [callbackId, registerCallbackFn],
  );

  return {
    navigateToAdd,
  };
};

