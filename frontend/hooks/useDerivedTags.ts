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

  useEffect(() => {
    try {
      if (tagData) {
        const parsedData = parseTag(tagData);
        if (parsedData?.id === -1) {
          setActivityNode(null);
          setProjectNode(null);
        } else if (parsedData) {
          if (parsedData.moduleType === "activity") {
            setActivityNode(parsedData);
            setProjectNode(null);
            setParentTagID(null);
          } else {
            setProjectNode(parsedData);
            setParentTagID(parsedData.parent);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing tagData:", error);
    }
  }, [parseTag, tagData]);

  useEffect(() => {
    try {
      if (parentTagData) {
        const parsedData = parseTag(parentTagData);
        if (parsedData?.id === -1) {
          setProjectNode(null);
        } else {
          setActivityNode(parsedData);
        }
      }
    } catch (error) {
      console.error("Error parsing parentTagData:", error);
    }
  }, [parseTag, parentTagData]);

  return { activityNode, projectNode };
}
