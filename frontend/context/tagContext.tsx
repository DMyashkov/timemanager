// timemanager/frontend/context/TagContext.tsx

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

  const getAuthConfig = useCallback(async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }

    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
  }, []);

  const generateDataIndex = useCallback((tree: TagTreeNode[]): DataIndex => {
    const index: DataIndex = {};

    const recursiveBuild = (node: TagTreeNode, path: string[] = []) => {
      index[node.id] = {
        item: {
          id: node.id,
          title: node.title,
          type: node.type,
          productive: node.productive,
          lapName: node.lapName,
          colorPreset: node.colorPreset,
        },
        children: node.children ? node.children.map((child) => child.id) : [],
        path, // Use IDs instead of titles
      };

      node.children?.forEach(
        (child) => recursiveBuild(child, [...path, node.id]), // Append current node's ID to the path
      );
    };

    tree.forEach((node) => recursiveBuild(node));
    return index;
  }, []);

  const refreshTreeData = useCallback(async () => {
    try {
      const config = await getAuthConfig();
      const treeResponse = await axios.get(`${baseURL}/tags/tree/`, config);

      const tree = treeResponse.data; // Backend response structure
      setTreeData(tree);

      // Generate the local dataIndex based on the tree
      const localIndex = generateDataIndex(tree);
      setDataIndex(localIndex);
    } catch (error) {
      console.error("Failed to refresh tree data:", error);
    }
  }, [baseURL, getAuthConfig, generateDataIndex]);

  const refreshDataIndex = useCallback(async () => {
    try {
      const config = await getAuthConfig();
      const response = await axios.get(`${baseURL}/tags/data_index/`, config);
      console.log("Fetched dataIndex:", JSON.stringify(response.data, null, 2));
      setDataIndex(response.data);
    } catch (error) {
      console.error("Failed to refresh dataIndex:", error);
    }
  }, [baseURL, getAuthConfig]);

  // ---------------- TREE MANIPULATION FUNCTIONS ----------------

  const insertTagIntoTree = useCallback(
    (
      treeNodes: TagTreeNode[],
      newId: string,
      payload: TagPayload,
    ): TagTreeNode[] => {
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
        .filter((node) => node.id !== tagId)
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

  // ---------------- LOCAL CRUD HELPERS ----------------

  const localCreateTag = useCallback(
    (newId: string, payload: TagPayload) => {
      if (!dataIndex) return;

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
          ? [...(dataIndex[payload.parent]?.path ?? []), payload.parent]
          : [],
      };

      const updatedIndex = { ...dataIndex, [newId]: newItem };

      if (payload.parent && updatedIndex[payload.parent]) {
        updatedIndex[payload.parent].children.push(newId);
      }

      setDataIndex(updatedIndex);
      setTreeData((prevTree) => insertTagIntoTree(prevTree, newId, payload));
    },
    [dataIndex, insertTagIntoTree],
  );

  const localUpdateTag = useCallback(
    (tagId: string, updates: Partial<TagPayload>) => {
      if (!dataIndex || !dataIndex[tagId]) return;

      const existing = dataIndex[tagId];
      const updatedIndex = { ...dataIndex };

      updatedIndex[tagId] = {
        ...existing,
        item: {
          ...existing.item,
          ...updates,
        },
      };

      if (updates.parent && updates.parent !== existing.path.at(-1)) {
        const newParentPath = updatedIndex[updates.parent]?.path || [];
        updatedIndex[tagId].path = [...newParentPath, updates.parent];
      }

      setDataIndex(updatedIndex);
      setTreeData((prevTree) => updateTagInTree(prevTree, tagId, updates));
    },
    [dataIndex, updateTagInTree],
  );

  const localDeleteTag = useCallback(
    (tagId: string) => {
      if (!dataIndex || !dataIndex[tagId]) return;

      const updatedIndex = { ...dataIndex };

      const removeChildren = (id: string) => {
        const children = updatedIndex[id]?.children || [];
        children.forEach((childId) => removeChildren(childId));
        delete updatedIndex[id];
      };

      removeChildren(tagId);

      const parentId = updatedIndex[tagId]?.path.at(-1);
      if (parentId && updatedIndex[parentId]) {
        updatedIndex[parentId].children = updatedIndex[
          parentId
        ].children.filter((childId) => childId !== tagId);
      }

      setDataIndex(updatedIndex);
      setTreeData((prevTree) => deleteTagFromTree(prevTree, tagId));
    },
    [dataIndex, deleteTagFromTree],
  );

  // ---------------- PUBLIC ACTIONS ----------------

  const createTagAction = useCallback(
    async (payload: TagPayload) => {
      const enrichedPayload = {
        ...payload,
        createdAt: new Date().toISOString(),
      };

      const tempId = `temp-${Date.now()}`;
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

        if (dataIndex) {
          localDeleteTag(tempId);
          localCreateTag(realId, enrichedPayload);
        }
      } catch (error) {
        console.error("Error creating tag:", error);
        localDeleteTag(tempId);
      }
    },
    [baseURL, getAuthConfig, dataIndex, localCreateTag, localDeleteTag],
  );

  const updateTagAction = useCallback(
    async (id: string, payload: Partial<TagPayload>) => {
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
    [baseURL, getAuthConfig, localUpdateTag],
  );

  const deleteTagAction = useCallback(
    async (id: string) => {
      const oldDataIndex = dataIndex ? { ...dataIndex } : null;
      const oldTreeData = treeData ? [...treeData] : [];

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
    [baseURL, getAuthConfig, dataIndex, treeData, localDeleteTag],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Token ${token}`;
          console.log("Auth token found, fetching data...");
          await refreshDataIndex();
          await refreshTreeData();
        } else {
          console.log("No auth token found, skipping data fetch.");
        }
      } catch (error) {
        console.error("Error checking for auth token:", error);
      }
    };
    void fetchData();
  }, [refreshDataIndex, refreshTreeData]);

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
