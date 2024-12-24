// timemanager/frontend/constants/tagContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  ColorPresets,
  DataIndexItem,
  moduleType,
  TagTreeNode,
  TagPayload,
  DataIndex,
} from "@/constants/interfaces"; // Import all necessary types

// The interface for the context value
interface TagContextValue {
  dataIndex: DataIndex | null;
  setDataIndex: React.Dispatch<React.SetStateAction<DataIndex | null>>;

  treeData: TagTreeNode[];
  setTreeData: React.Dispatch<React.SetStateAction<TagTreeNode[]>>;

  createTag: (payload: TagPayload) => Promise<void>;
  updateTag: (id: string, payload: Partial<TagPayload>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
}

// ---------------- CREATE THE CONTEXT ----------------

const TagContext = createContext<TagContextValue | undefined>(undefined);

// ---------------- PROVIDER COMPONENT ----------------

interface TagProviderProps {
  children: React.ReactNode;
}

export function TagProvider({ children }: TagProviderProps) {
  const [dataIndex, setDataIndex] = useState<DataIndex | null>(null);
  const [treeData, setTreeData] = useState<TagTreeNode[]>([]);
  const baseURL = "http://127.0.0.1:8000/api"; // Usually stable (doesn't change)

  // ---------------- HELPER FUNCTIONS (useCallback) ----------------

  /**
   * Helper to get auth token from AsyncStorage and build axios config.
   * Wrapped in useCallback so references remain stable.
   */
  const getAuthConfig = useCallback(async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }

    return {
      headers: {
        "Content-Type": "application/json",
        // If your backend expects "Token <token>", keep it that way;
        // otherwise use `Bearer <token>`.
        Authorization: `Token ${token}`,
      },
    };
  }, []);

  /**
   * Re-fetch the entire DataIndex from the server.
   * Wrapped in useCallback for stable reference.
   */
  const refreshDataIndex = useCallback(async () => {
    try {
      const config = await getAuthConfig();
      const response = await axios.get(`${baseURL}/tags/data_index/`, config);
      setDataIndex(response.data);
    } catch (error) {
      console.error("Failed to refresh dataIndex:", error);
    }
  }, [baseURL, getAuthConfig]);

  /**
   * Re-fetch the entire tree from the server.
   * Wrapped in useCallback for stable reference.
   */
  const refreshTreeData = useCallback(async () => {
    try {
      const config = await getAuthConfig();
      const treeResponse = await axios.get(`${baseURL}/tags/tree/`, config);
      setTreeData(treeResponse.data);
    } catch (error) {
      console.error("Failed to refresh tree data:", error);
    }
  }, [baseURL, getAuthConfig]);

  // ---------------- TREE MANIPULATION FUNCTIONS ----------------

  const insertTagIntoTree = useCallback(
    (
      treeNodes: TagTreeNode[],
      newId: string,
      payload: TagPayload,
    ): TagTreeNode[] => {
      // If no parent => top-level
      if (!payload.parent) {
        return [
          ...treeNodes,
          {
            id: newId,
            title: payload.title,
            type: payload.type,
            productive: payload.productive,
            lapName: payload.lapName,
            colorPreset: payload.colorPreset,
            children: [],
          },
        ];
      }

      // Else, recursively find the parent in the tree
      return treeNodes.map((node) => {
        if (node.id === payload.parent) {
          const newChild: TagTreeNode = {
            id: newId,
            title: payload.title,
            type: payload.type,
            productive: payload.productive,
            lapName: payload.lapName,
            colorPreset: payload.colorPreset,
            children: [],
          };
          const children = node.children
            ? [...node.children, newChild]
            : [newChild];
          return { ...node, children };
        }

        if (node.children?.length) {
          return {
            ...node,
            children: insertTagIntoTree(node.children, newId, payload),
          };
        }

        return node;
      });
    },
    [],
  );

  const updateTagInTree = useCallback(
    (
      treeNodes: TagTreeNode[],
      tagId: string,
      updates: Partial<TagPayload>,
    ): TagTreeNode[] => {
      return treeNodes.map((node) => {
        if (node.id === tagId) {
          return {
            ...node,
            title: updates.title ?? node.title,
            type: updates.type ?? node.type,
            productive: updates.productive ?? node.productive,
            lapName: updates.lapName ?? node.lapName,
            colorPreset: updates.colorPreset ?? node.colorPreset,
          };
        }

        if (node.children?.length) {
          return {
            ...node,
            children: updateTagInTree(node.children, tagId, updates),
          };
        }

        return node;
      });
    },
    [],
  );

  const deleteTagFromTree = useCallback(
    (treeNodes: TagTreeNode[], tagId: string): TagTreeNode[] => {
      return treeNodes
        .filter((node) => node.id !== tagId) // Remove matching node
        .map((node) => {
          if (node.children?.length) {
            return {
              ...node,
              children: deleteTagFromTree(node.children, tagId),
            };
          }
          return node;
        });
    },
    [],
  );

  // ---------------- LOCAL CRUD HELPERS (Optimistic) ----------------

  const localCreateTag = useCallback(
    (newId: string, payload: TagPayload) => {
      if (!dataIndex) return;

      // 1) Build local entry
      const newItem: DataIndexItem = {
        item: {
          id: newId,
          title: payload.title,
          type: payload.type,
          productive: payload.productive,
          lapName: payload.lapName,
          colorPreset: payload.colorPreset,
        },
        children: [],
        // Build the path based on the parent's path
        path: payload.parent
          ? [...(dataIndex[payload.parent]?.path ?? []), payload.parent]
          : [],
      };

      // 2) Insert new item into dataIndex
      const updatedIndex = { ...dataIndex, [newId]: newItem };

      // 3) If there's a parent, add this ID to parent's children
      if (payload.parent) {
        const parentEntry = updatedIndex[payload.parent];
        parentEntry?.children.push(newId);
      }

      // 4) Update local state
      setDataIndex(updatedIndex);

      // 5) Insert into treeData
      setTreeData((prevTree) => insertTagIntoTree(prevTree, newId, payload));
    },
    [dataIndex, insertTagIntoTree],
  );

  const localUpdateTag = useCallback(
    (tagId: string, updates: Partial<TagPayload>) => {
      if (!dataIndex || !dataIndex[tagId]) return;

      // 1) Update in dataIndex
      const updatedIndex = { ...dataIndex };
      const existing = updatedIndex[tagId];
      updatedIndex[tagId] = {
        ...existing,
        item: {
          ...existing.item,
          title: updates.title ?? existing.item.title,
          type: updates.type ?? existing.item.type,
          productive: updates.productive ?? existing.item.productive,
          lapName: updates.lapName ?? existing.item.lapName,
          colorPreset: updates.colorPreset ?? existing.item.colorPreset,
        },
        // children, path remain unless you’re re-parenting
      };
      setDataIndex(updatedIndex);

      // 2) Update tree data
      setTreeData((prevTree) => updateTagInTree(prevTree, tagId, updates));
    },
    [dataIndex, updateTagInTree],
  );

  const removeTagAndChildren = useCallback(
    (indexObj: DataIndex, tagId: string) => {
      const children = indexObj[tagId]?.children ?? [];
      for (const childId of children) {
        removeTagAndChildren(indexObj, childId);
      }

      // Remove from parent
      const parentId = indexObj[tagId]?.path.at(-1);
      if (parentId && indexObj[parentId]) {
        indexObj[parentId].children = indexObj[parentId].children.filter(
          (c) => c !== tagId,
        );
      }

      // Finally, delete from index
      delete indexObj[tagId];
    },
    [],
  );

  const localDeleteTag = useCallback(
    (tagId: string) => {
      if (!dataIndex || !dataIndex[tagId]) return;

      // 1) Remove from dataIndex
      const updatedIndex = { ...dataIndex };
      removeTagAndChildren(updatedIndex, tagId);
      setDataIndex(updatedIndex);

      // 2) Remove from treeData
      setTreeData((prevTree) => deleteTagFromTree(prevTree, tagId));
    },
    [dataIndex, removeTagAndChildren, deleteTagFromTree],
  );

  // ---------------- PUBLIC ACTIONS (CREATE, UPDATE, DELETE) ----------------

  const createTagAction = useCallback(
    async (payload: TagPayload) => {
      // 1) Generate a temporary local ID
      const tempId = `temp-${Date.now()}`; // Use a string to avoid conflicts

      // 2) Optimistically create locally
      localCreateTag(tempId, payload);

      // 3) Real API call
      try {
        const config = await getAuthConfig();
        const response = await axios.post(`${baseURL}/tags/`, payload, config);
        const createdTag = response.data;
        const realId = createdTag.id.toString(); // Ensure it's a string

        // Option B: Reconcile local temp ID with real ID
        if (dataIndex) {
          // Remove the temp one
          localDeleteTag(tempId);
          // Create a new local entry with the actual ID
          localCreateTag(realId, payload);
        }
      } catch (error) {
        console.error("Error creating tag:", error);
        // Revert local creation
        localDeleteTag(tempId);
      }
    },
    [baseURL, getAuthConfig, dataIndex, localCreateTag, localDeleteTag],
  );

  const updateTagAction = useCallback(
    async (id: string, payload: Partial<TagPayload>) => {
      // 1) Optimistic update
      localUpdateTag(id, payload);

      // 2) Real API call
      try {
        const config = await getAuthConfig();
        await axios.put(`${baseURL}/tags/${id}/`, payload, config);
      } catch (error) {
        console.error("Error updating tag:", error);
        // Optionally, revert local changes or handle error
      }
    },
    [baseURL, getAuthConfig, localUpdateTag],
  );

  const deleteTagAction = useCallback(
    async (id: string) => {
      // 1) Cache old data for revert
      const oldDataIndex = dataIndex ? { ...dataIndex } : null;
      const oldTreeData = treeData ? [...treeData] : [];

      // 2) Optimistically remove
      localDeleteTag(id);

      // 3) Real API call
      try {
        const config = await getAuthConfig();
        await axios.delete(`${baseURL}/tags/${id}/`, config);
      } catch (error) {
        console.error("Error deleting tag:", error);
        // Revert local deletion
        if (oldDataIndex) setDataIndex(oldDataIndex);
        if (oldTreeData) setTreeData(oldTreeData);
      }
    },
    [baseURL, getAuthConfig, dataIndex, treeData, localDeleteTag],
  );

  // ---------------- ON MOUNT, LOAD INITIAL DATA ----------------
  // All dependencies are stable references due to useCallback
  useEffect(() => {
    const fetchData = async () => {
      await refreshDataIndex();
      await refreshTreeData();
    };
    void fetchData();
  }, [refreshDataIndex, refreshTreeData]);

  // ---------------- PROVIDE THE CONTEXT ----------------
  const value: TagContextValue = {
    dataIndex,
    setDataIndex,
    treeData,
    setTreeData,
    createTag: createTagAction,
    updateTag: updateTagAction,
    deleteTag: deleteTagAction,
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
}

// ---------------- CUSTOM HOOK FOR CONSUMERS ----------------

export function useTagContext() {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
}
