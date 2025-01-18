// timemanager/frontend/context/TagContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  DataIndexItem,
  ActivityData,
  TagPayload,
  DataIndexLocal,
} from "@/constants/interfaces"; // Import all necessary types

// The interface for the context value
interface TagContextValue {
  dataIndex: DataIndexLocal | null;
  setDataIndex: React.Dispatch<React.SetStateAction<DataIndexLocal | null>>;

  treeData: ActivityData | null;
  setTreeData: React.Dispatch<React.SetStateAction<ActivityData | null>>;

  createTag: (payload: TagPayload) => Promise<void>;
  updateTag: (id: number, payload: Partial<TagPayload>) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
}

// ---------------- CREATE THE CONTEXT ----------------

const TagContext = createContext<TagContextValue | undefined>(undefined);

// ---------------- PROVIDER COMPONENT ----------------

interface TagProviderProps {
  children: React.ReactNode;
}

export function TagProvider({ children }: TagProviderProps) {
  const [dataIndex, setDataIndex] = useState<DataIndexLocal | null>(null);

  const [treeData, setTreeData] = useState<ActivityData | null>(null);
  const [authConfig, setAuthConfig] = useState<{
    headers: Record<string, string>;
  } | null>(null); // Cache auth config
  const baseURL = "http://127.0.0.1:8000/api";

  // ---------------- HELPER FUNCTIONS (useCallback) ----------------

  const loadAuthToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }
      // console.log("Auth token loaded:", token);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      setAuthConfig(config);
      return config; // Return the config
    } catch (error) {
      console.error("Failed to load auth token:", error);
      throw new Error("Failed to load auth token");
    }
  }, []);

  const getAuthConfig = useCallback(async () => {
    // console.log("Auth config state:", authConfig);
    if (authConfig) {
      return authConfig; // Return cached config
    }

    // console.log("No cached auth config found. Loading token...", authConfig);

    // If no cached config, load it
    const newConfig = await loadAuthToken();
    return newConfig;
  }, [authConfig, loadAuthToken]);

  const refreshTreeData = useCallback(async () => {
    try {
      const config = await getAuthConfig();

      // console.log("TREE AUTH CONFIG:", JSON.stringify(config, null, 2));
      if (!config.headers.Authorization) {
        console.error("No Authorization header set. Aborting request.");
        return;
      }

      const treeResponse = await axios.get(`${baseURL}/tags/tree/`, config);

      // Extract the first element if it's an array
      const tree: ActivityData = Array.isArray(treeResponse.data)
        ? treeResponse.data[0]
        : treeResponse.data;

      setTreeData(tree);
    } catch (error) {
      console.error("Failed to refresh tree data:", error);
    }
  }, [getAuthConfig]);

  const refreshDataIndex = useCallback(async () => {
    try {
      const config = await getAuthConfig();
      if (!config.headers.Authorization) {
        console.error("No Authorization header set. Aborting request.");
        return;
      }

      const response = await axios.get(`${baseURL}/tags/data_index/`, config);

      // Create a new Map and populate it with the fetched data
      const dataIndex = new Map<number, DataIndexItem>(
        Object.values(response.data).map((item) => {
          const dataItem = item as DataIndexItem; // Assert the type
          return [dataItem.item.id, dataItem];
        }),
      );

      setDataIndex(dataIndex);
    } catch (error) {
      console.error("Failed to refresh dataIndex:", error);
    }
  }, [getAuthConfig]);

  // ---------------- TREE MANIPULATION FUNCTIONS ----------------

  const insertTagIntoTree = useCallback(
    (
      treeNode: ActivityData,
      newId: number,
      payload: TagPayload,
    ): ActivityData => {
      if (!payload.parent) {
        return {
          ...treeNode,
          children: [
            ...(treeNode.children || []),
            {
              id: newId,
              title: payload.title,
              type: payload.type,
              productive: payload.productive,
              lapName: payload.lapName,
              colorPreset: payload.colorPreset,
              children: [],
            },
          ],
        };
      }

      return {
        ...treeNode,
        children: (treeNode.children || []).map((node) => {
          if (node.id === payload.parent) {
            const newChild: ActivityData = {
              id: newId,
              title: payload.title,
              type: payload.type,
              productive: payload.productive,
              lapName: payload.lapName,
              colorPreset: payload.colorPreset,
              children: [],
            };
            return {
              ...node,
              children: node.children
                ? [...node.children, newChild]
                : [newChild],
            };
          }

          if (node.children?.length) {
            return insertTagIntoTree(node, newId, payload);
          }

          return node;
        }),
      };
    },
    [],
  );

  const updateTagInTree = useCallback(
    (
      treeNode: ActivityData,
      tagId: number,
      updates: Partial<TagPayload>,
    ): ActivityData => {
      return {
        ...treeNode,
        children: (treeNode.children || []).map((node) => {
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
            return updateTagInTree(node, tagId, updates);
          }

          return node;
        }),
      };
    },
    [],
  );

  const deleteTagFromTree = useCallback(
    (treeNode: ActivityData, tagId: number): ActivityData => {
      dataIndex?.delete(tagId);
      return {
        ...treeNode,
        children: (treeNode.children || [])
          .filter((node) => node.id !== tagId)
          .map((node) => {
            if (node.children?.length) {
              return deleteTagFromTree(node, tagId);
            }
            return node;
          }),
      };
    },
    [dataIndex],
  );

  // ---------------- LOCAL CRUD HELPERS ----------------

  const localCreateTag = useCallback(
    (newId: number, payload: TagPayload) => {
      if (!dataIndex || !treeData) return;

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
        path: payload.parent
          ? [...(dataIndex.get(payload.parent)?.path ?? []), payload.parent]
          : [],
      };

      // const updatedIndex = { ...dataIndex, [newId]: newItem };
      const updatedIndex = new Map(dataIndex);
      updatedIndex.set(newId, newItem);

      if (payload.parent && updatedIndex.has(payload.parent)) {
        const parentItem = updatedIndex.get(payload.parent);
        if (parentItem) {
          parentItem.children.push(newId);
          updatedIndex.set(payload.parent, { ...parentItem });
        }
      }

      setDataIndex(updatedIndex);
      setTreeData((prevTree) =>
        prevTree ? insertTagIntoTree(prevTree, newId, payload) : null,
      );
    },
    [dataIndex, treeData, insertTagIntoTree],
  );

  const localUpdateTag = useCallback(
    (tagId: number, updates: Partial<TagPayload>) => {
      if (!dataIndex || !treeData || !dataIndex.has(tagId)) return;

      const existing = dataIndex.get(tagId);
      if (!existing) return;

      const updatedIndex = new Map(dataIndex);
      const updatedItem = {
        ...existing,
        item: {
          ...existing.item,
          ...updates,
        },
      };

      if (updates.parent && updates.parent !== existing.path.at(-1)) {
        const newParentPath = updatedIndex.get(updates.parent)?.path || [];
        updatedItem.path = [...newParentPath, updates.parent];
      }

      updatedIndex.set(tagId, updatedItem);

      setDataIndex(updatedIndex);
      setTreeData((prevTree) =>
        prevTree ? updateTagInTree(prevTree, tagId, updates) : null,
      );
    },
    [dataIndex, treeData, updateTagInTree],
  );

  const localDeleteTag = useCallback(
    (tagId: number) => {
      if (!dataIndex || !treeData || !dataIndex.has(tagId)) return;

      // Create a shallow copy of the Map to maintain immutability
      const updatedIndex = new Map(dataIndex);
      const updatedTree = deleteTagFromTree(treeData, tagId);

      // console.log("ZEROOOOOOO STEP index:", updatedIndex);
      // console.log("NOT ZERO STEP index: ", dataIndex);

      const removeChildren = (id: number) => {
        const children = updatedIndex.get(id)?.children || [];

        for (const childId of children) {
          removeChildren(childId);
        }

        updatedIndex.delete(id);
      };

      // console.log("Deleting tag:", tagId);
      // console.log("FIRST STEP updated index:", updatedIndex);
      // Remove the tag and its children
      removeChildren(tagId);

      // Update the parent's children, if applicable
      const parentId = dataIndex.get(tagId)?.path.at(-1);
      if (parentId !== undefined && updatedIndex.has(parentId)) {
        const parentItem = updatedIndex.get(parentId);
        if (parentItem) {
          parentItem.children = parentItem.children.filter(
            (childId) => childId !== tagId,
          );
          console.log("Parent item:", parentItem);
          updatedIndex.set(parentId, { ...parentItem });
        }
      }

      console.log("Updated index:", updatedIndex);
      console.log("Updated tree:", JSON.stringify(updatedTree, null, 2));

      setDataIndex(updatedIndex);
      setTreeData(updatedTree);
    },
    [dataIndex, treeData, deleteTagFromTree],
  );

  // ---------------- PUBLIC ACTIONS ----------------

  const createTagAction = useCallback(
    async (payload: TagPayload) => {
      const enrichedPayload = {
        ...payload,
        createdAt: new Date().toISOString(),
      };

      const tempId = Date.now();
      localCreateTag(tempId, enrichedPayload);

      try {
        const config = await getAuthConfig();
        const response = await axios.post(
          `${baseURL}/tags/`,
          enrichedPayload,
          config,
        );
        const createdTag = response.data;
        const realId = createdTag.id.toString();

        if (dataIndex && treeData) {
          localDeleteTag(tempId);
          localCreateTag(realId, enrichedPayload);
        }
      } catch (error) {
        console.error("Error creating tag:", error);
        localDeleteTag(tempId);
      }
    },
    [getAuthConfig, dataIndex, treeData, localCreateTag, localDeleteTag],
  );

  const updateTagAction = useCallback(
    async (id: number, payload: Partial<TagPayload>) => {
      const enrichedPayload = {
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      localUpdateTag(id, enrichedPayload);

      try {
        const config = await getAuthConfig();
        await axios.put(`${baseURL}/tags/${id}/`, enrichedPayload, config);
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    },
    [getAuthConfig, localUpdateTag],
  );

  const deleteTagAction = useCallback(
    async (id: number) => {
      const oldDataIndex = dataIndex;
      const oldTreeData = treeData;

      localDeleteTag(id);

      try {
        const config = await getAuthConfig();
        await axios.delete(`${baseURL}/tags/${id}/`, config);
      } catch (error) {
        console.error("Error deleting tag:", error);
        if (oldDataIndex) setDataIndex(oldDataIndex);
        if (oldTreeData) setTreeData(oldTreeData);
      }
    },
    [getAuthConfig, dataIndex, treeData, localDeleteTag],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authConfig = await getAuthConfig();
        if (authConfig) {
          // console.log("Auth token found, fetching data...");
          await refreshDataIndex();
          await refreshTreeData();
        } else {
          // console.log("No auth token found, skipping data fetch.");
        }
      } catch (error) {
        console.error("Error checking for auth token:", error);
      }
    };
    void fetchData();
  }, [refreshDataIndex, refreshTreeData, getAuthConfig]);

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

export function useTagContext() {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
}
