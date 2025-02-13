import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import useStyles from "./styles";
import ActivityItem from "@/components/module/activityItem/activityItem";
import ProjectItem from "@/components/module/projectItem/projectItem";
import type { TagData, ColorPresets } from "@/constants/interfaces";
import { useTagContext } from "@/context/TagContext";

interface PathPickerProps {
  moduleName?: string;
  isProject?: boolean;
  moduleColorPallete: ColorPresets;
  parent: TagData | null; // We pass in the "parent" TagData if available
  setParent: (parent: TagData) => void; // Possibly used for changing parent
}

export default function PathPicker({
  moduleName = "New Activity",
  moduleColorPallete,
  parent,
  setParent,
  isProject = false,
}: PathPickerProps) {
  const styles = useStyles();
  const { getTag } = useTagContext();

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
      let current = parent;

      while (current) {
        chain.push(current);

        // If the current has no parent ID, stop
        if (!current.parent) break;

        // Otherwise fetch the parent TagData from the DB
        const parentTag = await getTag(current.parent);
        if (!parentTag) break;

        current = parentTag;
      }

      // chain is now from bottom -> top, so reverse it if you want top -> bottom
      chain.reverse();
      setPath(chain);
    })();
  }, [parent, getTag]);

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
        {path.map((tag) => (
          <ActivityItem
            isExplicitlyExpanded
            key={tag.id}
            activityName={tag.title}
            activityColor={tag.colorPreset}
            clickable={false}
          />
        ))}
        {/* Finally, render the new or edited module at the end of the path */}
        {isProject ? (
          <ProjectItem
            activityName={moduleName}
            activityColor={moduleColorPallete}
            clickable={false}
          />
        ) : (
          <ActivityItem
            isExplicitlyExpanded
            activityName={moduleName}
            activityColor={moduleColorPallete}
            clickable={false}
          />
        )}
      </View>
    </View>
  );
}
