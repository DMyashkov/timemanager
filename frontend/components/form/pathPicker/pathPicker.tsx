import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import ActivityItem from "@/components/module/activityItem/activityItem";
import ProjectItem from "@/components/module/projectItem/projectItem";
import type { TagData, ColorPresets } from "@/constants/interfaces";
import { useTagContext } from "@/context/TagContext";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "@/db/schema";

interface PathPickerProps {
  moduleName?: string;
  isProject?: boolean;
  moduleColorPallete: ColorPresets;
  parent: number | null; // We pass in the "parent" TagData if available
  setParent: (parent: number) => void; // Possibly used for changing parent
  shouldDisplayNew?: boolean; // If you want to display a "New" button
}

export default function PathPicker({
  moduleName = "New Activity",
  moduleColorPallete,
  parent,
  setParent,
  isProject = false,
  shouldDisplayNew = true,
}: PathPickerProps) {
  const styles = useStyles();
  const { getTag } = useTagContext();

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });

  // We'll store the *entire path* (from root -> parent -> parent's parent -> etc.)
  const [path, setPath] = useState<TagData[]>([]);

  useEffect(() => {
    // Use an async IIFE or a separate function to fetch the chain of parents
    (async () => {
      if (!parent) {
        // If there's no parent, the path is empty
        setPath([]);
        return;
      }

      // Build the path by walking up the tree
      const chain: TagData[] = [];
      let current: number = parent;

      while (current) {
        const currentTag = await getTag(db, current);
        if (!currentTag) break; // If we can't find the tag, stop
        chain.push(currentTag);
        if (!currentTag.parent) break;
        current = currentTag.parent; // Move to the parent
      }

      // chain is now from bottom -> top, so reverse it if you want top -> bottom
      chain.reverse();
      setPath(chain);
    })();
  }, [parent, getTag]);
  console.log("PathPicker path", path);

  // If you’d like to handle a "Change" button for re-selecting parent,
  // you'll define a function and pass it to onPress below.
  const handleChangePress = () => {
    console.log("Change parent pressed!");
    // Possibly open a modal or navigates to a screen to pick a new parent, etc.
  };

  return (
    <View style={styles.container}>
      {/* Header row with "Path" and "Change" button */}
      <View style={styles.topRow}>
        <Text style={styles.title}>Path</Text>
        <TouchableOpacity onPress={handleChangePress}>
          <Text style={styles.rightButton}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pathContainer}>
        {/* Render the chain of parents first */}
        {path.map((tag, index) => (
          <ActivityItem
            isExplicitlyExpanded={
              shouldDisplayNew ? true : index !== path.length - 1
            }
            key={tag.id}
            activityName={tag.title}
            activityColor={tag.colorPreset}
            clickable={false}
          />
        ))}
        {/* Finally, render the new or edited module at the end of the path */}
        {shouldDisplayNew &&
          (isProject ? (
            <ProjectItem
              activityName={moduleName || "New Project"}
              activityColor={moduleColorPallete}
              clickable={false}
            />
          ) : (
            <ActivityItem
              isExplicitlyExpanded={false}
              activityName={moduleName || "New Activity"}
              activityColor={moduleColorPallete}
              clickable={false}
            />
          ))}
      </View>
    </View>
  );
}
