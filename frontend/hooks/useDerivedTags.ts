import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useTagContext } from "@/context/TagContext";
import { useEffect, useState } from "react";
import { TagData } from "@/constants/interfaces";

export function useDerivedTags(tagId: number | null) {
  const [parentTagID, setParentTagID] = useState<number | null>(null);
  const [activityNode, setActivityNode] = useState<TagData | null>(null);
  const [projectNode, setProjectNode] = useState<TagData | null>(null);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });

  const { parseTag } = useTagContext();

  const { data: tagData } = useLiveQuery(
    db
      .select()
      .from(tags)
      .where(eq(tags.id, tagId ?? -1)),
    [tagId],
  );

  const { data: parentTagData } = useLiveQuery(
    db
      .select()
      .from(tags)
      .where(eq(tags.id, parentTagID ?? -1)),
    [parentTagID],
  );

  // console.log("tagData and parentTagData:", tagData, parentTagData);
  // console.log("ActivityNode and ProjectNode:", activityNode, projectNode);

  useEffect(() => {
    try {
      if (tagData && tagData.length > 0) {
        const parsedData = parseTag(tagData);
        // console.log("Parsed tagData:", parsedData);
        if (parsedData) {
          if (parsedData.moduleType === "activity") {
            setActivityNode(parsedData);
            // console.log("SETTING ACTIVITY NODE");
            setProjectNode(null);
            setParentTagID(null);
          } else {
            setProjectNode(parsedData);
            setParentTagID(parsedData.parent);
          }
        } else {
          // console.log("Parsed data is null");
          setActivityNode(null);
          setProjectNode(null);
        }
      }
    } catch (error) {
      console.error("Error parsing tagData:", error);
    }
  }, [parseTag, tagData]);

  useEffect(() => {
    try {
      if (parentTagData && parentTagData.length > 0) {
        console.log("Parent tag data:", parentTagData);
        const parsedData = parseTag(parentTagData);
        setActivityNode(parsedData);
      }
    } catch (error) {
      console.error("Error parsing parentTagData:", error);
    }
  }, [parseTag, parentTagData]);

  if (tagId === null || tagId === -1) {
    return { activityNode: null, projectNode: null };
  }

  return { activityNode, projectNode };
}
