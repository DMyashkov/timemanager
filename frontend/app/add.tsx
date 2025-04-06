import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import useStyles from "./styles/addStyles";
import { useTheme } from "@context/ThemeContext";
import Switch from "@components/basic/switch/switch";
import TextField from "@/components/form/textField/textField";
import Picker from "@/components/form/picker/picker";
import ColorPicker from "@/components/form/colorPicker/colorPicker";
import { useEffect, useState } from "react";
import PathPicker from "@/components/form/pathPicker/pathPicker";
import { ColorPresets, type TagData } from "@/constants/interfaces";
import { moduleTypeEnum } from "@/constants/interfaces";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { eq } from "drizzle-orm";

import TrashCan from "@assets/icons/trash-can.svg";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";
import { useTagContext } from "@/context/TagContext";
import SwitchWrapper from "@/components/basic/switchWrapper/switchWrapper";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { schema, tags } from "@/db/schema";
import { useFocus } from "@/context/FocusContext";

export default function AddScreen() {
  const { parentId: parentIdString, rawIsAddScreen } = useLocalSearchParams();
  const parentId = Number.parseInt(parentIdString as string, 10);
  const isAddScreen = rawIsAddScreen === "true";

  const styles = useStyles();
  const { theme } = useTheme();

  // TagContext methods
  const { createTag, updateTag, deleteTag, getTag, parseTag } = useTagContext();

  // State for the parent tag and the current tag
  const [parent, setParent] = useState<TagData | null>(null);
  const [current, setCurrent] = useState<TagData | null>(null);

  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema: schema });

  const { data: parentIdData } = useLiveQuery(
    db.select().from(tags).where(eq(tags.id, parentId)),
  );

  const { data: parentOfParentIdDataRaw } = useLiveQuery(
    db
      .select()
      .from(tags)
      .where(eq(tags.id, current ? (current.parent ?? -1) : -1)),
  );

  const parentOfParentIdData =
    isAddScreen || !current || !current.parent ? null : parentOfParentIdDataRaw;

  useEffect(() => {
    try {
      if (parentIdData) {
        const parentTag = parentIdData;
        if (isAddScreen) {
          setParent(parseTag(parentTag));
        } else {
          setCurrent(parseTag(parentTag));
        }
      }
    } catch (e) {}
  }, [parentIdData, parseTag, isAddScreen]);

  useEffect(() => {
    try {
      if (parentOfParentIdData) {
        const parentTag = parentOfParentIdData;
        setParent(parseTag(parentTag));
      }
    } catch (e) {}
  }, [parentOfParentIdData, parseTag]);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const [saveButtonPressed, setSaveButtonPressed] = useState(false);

  // Color array for color picker
  const colorArray: ColorPresets[] = [ColorPresets.ORANGE, ColorPresets.GREEN];
  // const { popFocusStack, focusedPath } = useFocus();

  // Handler for deletion
  const handleDelete = async () => {
    if (current) {
      await deleteTag(db, current.id);
      // WHole table after delete
      console.log("Whole table after delete:", await db.select().from(tags));
      // popFocusStack();
      // console.log("popped focus stack");
      // console.log("New focus path:", focusedPath);
      router.back(); // Navigate back after deletion
    }
  };

  // Handler for creation
  const handleCreate = async (
    data: Omit<TagData, "id" | "synced" | "deleted">,
  ) => {
    // Build the payload
    const tagPayload: TagData & {
      id?: number;
      synced?: number;
      deleted?: number;
    } = {
      moduleType: data.moduleType,
      title: data.title,
      colorPreset: data.colorPreset,
      lapName: data.lapName || "Lap",
      parent: data.parent,
      productive: data.productive,
      children: [],
    };
    await createTag(db, tagPayload);
    router.back();
  };

  // Handler for update
  const handleUpdate = async (
    data: Omit<TagData, "id" | "synced" | "deleted">,
  ) => {
    if (!current) return;
    const updates = {
      moduleType: data.moduleType,
      title: data.title,
      colorPreset: data.colorPreset,
      lapName: data.lapName,
      parent: data.parent,
      productive: data.productive,
    };
    await updateTag(db, current.id, updates);
    router.back();
  };

  // Decide if we are editing a project or an activity
  const isProject = current?.moduleType === moduleTypeEnum.project;

  // For adding, we only need `parent` if you strictly require a parent in your logic.
  // If you require a parent, do something similar:
  if (isAddScreen && parentId && !parent) {
    // We do have a parentId but no parent fetched yet
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: isAddScreen
            ? "Create Tag"
            : `Edit ${isProject ? "Project" : "Activity"}`,
          headerRight: () =>
            !isAddScreen ? (
              <SysButton
                text="Save"
                onPress={() => {
                  setSaveButtonPressed(true);
                }}
              />
            ) : null,
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerAddScreen}>
          {/* We use a "saveButtonPressed" state so the child can detect and handle saving */}
          <ContentWrapper
            parent={parent}
            current={current}
            isAddScreen={isAddScreen}
            colorArray={colorArray}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            saveButtonPressed={saveButtonPressed}
            setSaveButtonPressed={setSaveButtonPressed}
          />
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

// Simple toggle to let child know to "save"
function ContentWrapper({
  parent,
  current,
  isAddScreen,
  colorArray,
  selectedColorIndex,
  setSelectedColorIndex,
  handleCreate,
  handleUpdate,
  handleDelete,
  saveButtonPressed,
  setSaveButtonPressed,
}: {
  parent: TagData | null;
  current: TagData | null;
  isAddScreen: boolean;
  colorArray: ColorPresets[];
  selectedColorIndex: number;
  setSelectedColorIndex: (index: number) => void;
  handleCreate: (data: Omit<TagData, "id" | "synced" | "deleted">) => void;
  handleUpdate: (data: Omit<TagData, "id" | "synced" | "deleted">) => void;
  handleDelete: () => void;
  saveButtonPressed: boolean;
  setSaveButtonPressed: (b: boolean) => void;
}) {
  const styles = useStyles();

  if (isAddScreen) {
    // We are creating a NEW tag under `parent`
    // Could be an Activity or a Project
    return (
      <SwitchWrapper
        buttons={[
          {
            text: "Activity",
            onPress: () => {},
          },
          {
            text: "Project",
            onPress: () => {},
          },
        ]}
        styleSwitch={styles.switchOuter}
      >
        {/* Activity AddSegment */}
        <View
          style={{
            flex: 1,
          }}
        >
          <AddSegment
            parent={parent}
            current={null}
            isProject={false}
            colorArray={colorArray}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            saveButtonPressed={saveButtonPressed}
            setSaveButtonPressed={setSaveButtonPressed}
          />
        </View>
        {/* Project AddSegment */}
        <View
          style={{
            flex: 1,
          }}
        >
          <AddSegment
            parent={parent}
            current={null}
            isProject={true}
            colorArray={colorArray}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            saveButtonPressed={saveButtonPressed}
            setSaveButtonPressed={setSaveButtonPressed}
          />
        </View>
      </SwitchWrapper>
    );
  }
  // We are EDITING the tag `current`
  if (!current) {
    return <Text>No current tag found</Text>;
  }
  return (
    <AddSegment
      parent={parent}
      current={current}
      isProject={current.moduleType === moduleTypeEnum.project}
      colorArray={colorArray}
      selectedColorIndex={selectedColorIndex}
      setSelectedColorIndex={setSelectedColorIndex}
      handleCreate={handleCreate}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      saveButtonPressed={saveButtonPressed}
      setSaveButtonPressed={setSaveButtonPressed}
    />
  );
}

interface AddSegmentProps {
  parent: TagData | null;
  current: TagData | null;
  isProject: boolean;
  colorArray: ColorPresets[];
  selectedColorIndex: number;
  setSelectedColorIndex: (i: number) => void;
  handleCreate: (data: Omit<TagData, "id" | "synced" | "deleted">) => void;
  handleUpdate: (data: Omit<TagData, "id" | "synced" | "deleted">) => void;
  handleDelete: () => void;
  saveButtonPressed: boolean;
  setSaveButtonPressed: (b: boolean) => void;
}

/**
 * A single form segment that can handle either an Activity or Project,
 * depending on `isProject`.
 */
function AddSegment(props: AddSegmentProps) {
  const {
    parent,
    current,
    isProject,
    colorArray,
    selectedColorIndex,
    setSelectedColorIndex,
    handleCreate,
    handleUpdate,
    handleDelete,
    saveButtonPressed,
    setSaveButtonPressed,
  } = props;

  const styles = useStyles();
  const { theme } = useTheme();

  // State for name and lapName
  const [moduleName, setModuleName] = useState(current?.title ?? "");
  const [lapName, setLapName] = useState(current?.lapName ?? "Lap");

  // For activity vs project, we store "productive"
  // If editing, default to current.productive
  // If creating, default to parent's productivity or `false` if no parent
  const [productivity, setProductivity] = useState<boolean>(
    current?.productive ?? parent?.productive ?? false,
  );

  useEffect(() => {
    // If the "Save" button was pressed in the header, handle the update
    if (saveButtonPressed) {
      console.log("Save button pressed");
      if (current) {
        // Editing: handleUpdate
        const queryData: Omit<TagData, "id" | "synced" | "deleted"> = {
          moduleType: isProject
            ? moduleTypeEnum.project
            : moduleTypeEnum.activity,
          title: moduleName,
          colorPreset: colorArray[selectedColorIndex],
          lapName,
          parent: parent?.id ?? 0, // or 0 if no parent
          productive: productivity,
          children: [],
        };
        handleUpdate(queryData);
      }
      setSaveButtonPressed(false);
    }
  }, [
    saveButtonPressed,
    setSaveButtonPressed,
    current,
    isProject,
    moduleName,
    lapName,
    selectedColorIndex,
    productivity,
    parent,
    colorArray,
    handleUpdate,
  ]);

  // The "create" button is local to the segment for new items
  const onCreatePress = () => {
    const queryData: Omit<TagData, "id" | "synced" | "deleted"> = {
      moduleType: isProject ? moduleTypeEnum.project : moduleTypeEnum.activity,
      title: moduleName,
      colorPreset: colorArray[selectedColorIndex],
      lapName,
      parent: parent?.id ?? 0,
      productive: productivity,
      children: [],
    };
    handleCreate(queryData);
  };

  // If there's no parent, handle it as needed
  // Could also skip. For example, if "root" is allowed, parent can be `null`.
  // if (parent === null && current === null) {
  //   return <Text>Loading...</Text>;
  // }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16, gap: 15 }}
    >
      {/* Name input */}
      <TextField
        placeholder={isProject ? "Project Name" : "Activity Name"}
        startingText={moduleName}
        defaultText={moduleName}
        setModuleName={setModuleName}
      />

      {/* Productivity picker */}
      <Picker
        buttons={
          current == null
            ? [
                {
                  text: "Productive",
                  onPress: () => setProductivity(true),
                },
                {
                  text: "Unproductive",
                  onPress: () => setProductivity(false),
                },
              ]
            : [
                {
                  text: productivity ? "Productive" : "Unproductive",
                  onPress: () => {},
                },
              ]
        }
      />

      {/* Lap Name */}
      <TextField
        placeholder="Lap Name"
        startingText={lapName}
        defaultText={lapName}
        setModuleName={setLapName}
        rightHint
      />

      {/* For an Activity, show ColorPicker. For Project, it could be optional or the same. */}
      {isProject ? null : ( // if you do want them to pick color, you can use the same ColorPicker: // Projects might or might not use the color picker in your code;
        <ColorPicker
          colorPresets={colorArray}
          selectedColorIndex={selectedColorIndex}
          setSelectedColorIndex={setSelectedColorIndex}
        />
      )}

      {/* PathPicker: If your PathPicker requires a TagData parent,
          make sure it can handle parent === null */}
      {/* {parent && ( */}
      <PathPicker
        parent={parent}
        setParent={() => {
          // If you allow changing the parent, you'd call getTag(...) again or something.
          // This is left as an exercise, depending on how your PathPicker is implemented.
        }}
        moduleColorPallete={colorArray[selectedColorIndex]}
        moduleName={moduleName}
        isProject={isProject}
      />
      {/* )} */}

      {/* For new creation */}
      {current == null ? (
        <View style={styles.buttonProjectOuter}>
          <TouchableOpacity style={styles.button} onPress={onCreatePress}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // For editing (show a delete button)
        <View style={styles.buttonProjectOuter}>
          <TouchableOpacity style={styles.buttonProject} onPress={handleDelete}>
            <TrashCan
              fill={theme.color.red}
              width={20}
              height={20}
              style={{ marginBottom: 2 }}
            />
            <Text style={styles.buttonTextProject}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
