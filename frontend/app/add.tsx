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
import { useEffect, useMemo, useState } from "react";
import PathPicker from "@/components/form/pathPicker/pathPicker";
import {
  ColorPresets,
  type TagPayload,
  type DataIndexItem,
  type DataIndexLocal,
} from "@/constants/interfaces";
import { AdditionalProps } from "react-native-svg/lib/typescript/xml";
import SwitchWrapper from "@/components/basic/switchWrapper/switchWrapper";
import { moduleType } from "@/constants/interfaces";
import { Stack, router, useLocalSearchParams } from "expo-router";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AddQuery {
  type: moduleType;
  title: string;
  colorPreset: ColorPresets;
  lapName: string;
  parentId: number;
  productive: boolean;
}

import TrashCan from "@assets/icons/trash-can.svg";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";
import { useTagContext } from "@/context/TagContext";

export default function AddScreen() {
  const { parentId: parentIdString, rawIsAddScreen } = useLocalSearchParams();
  console.log("parentIdString:", parentIdString);
  const parentId = parentIdString
    ? Number.parseInt(parentIdString as string)
    : null;
  const isAddScreen = rawIsAddScreen === "true";
  const styles = useStyles();
  const { theme } = useTheme();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const colorArray: ColorPresets[] = [
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
    ColorPresets.ORANGE,
    ColorPresets.GREEN,
  ];

  // Utilize TagContext
  const { dataIndex, createTag, updateTag, deleteTag } = useTagContext();

  // Initialize parent and current states as null
  const [parent, setParent] = useState<DataIndexItem | null>(null);
  const [current, setCurrent] = useState<DataIndexItem | null>(null);

  useEffect(() => {
    if (dataIndex && parentId) {
      if (isAddScreen) {
        setParent(dataIndex.get(parentId) || null);
        setCurrent(null);
      } else {
        const currentItem = dataIndex.get(parentId) || null;
        const parentPath = currentItem?.path[currentItem.path.length - 1];
        setParent(parentPath ? dataIndex.get(parentPath) || null : null);
        setCurrent(currentItem);
      }
    }
  }, [dataIndex, parentId, isAddScreen]);

  const [saveButtonPressed, setSaveButtonPressed] = useState(false);
  const PADDING_HORIZONTAL = 22;

  console.log("Parent:", parent);
  console.log("id:", parentId);

  if (!parent || !dataIndex) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Implement handleDelete using TagContext's deleteTag
  const handleDelete = async () => {
    if (current) {
      await deleteTag(current.item.id);
      router.back(); // Navigate back after deletion
    }
  };

  const handleCreate = async (data: AddQuery) => {
    // Map AddQuery to TagPayload
    const tagPayload = {
      type: data.type,
      title: data.title,
      colorPreset: data.colorPreset,
      lapName: data.lapName,
      parent: data.parentId,
      productive: data.productive,
    };

    await createTag(tagPayload);
  };

  const handleUpdate = async (data: AddQuery) => {
    if (current) {
      // Map AddQuery to Partial<TagPayload>
      const tagUpdates: Partial<TagPayload> = {
        type: data.type,
        title: data.title,
        colorPreset: data.colorPreset,
        lapName: data.lapName,
        parent: data.parentId, // Assuming parentId is a string or null
        productive: data.productive,
      };

      await updateTag(current.item.id, tagUpdates);
    }
  };

  // Implement handleDelete using TagContext's deleteTag
  // const handleDeleteAction = async () => {
  //   if (current) {
  //     await deleteTag(current.item.id);
  //     router.back(); // Navigate back after deletion
  //   }
  // };

  const isProject = current?.item.type === moduleType.project;

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

      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={[styles.addScreen]}
      >
        <View style={styles.innerAddScreen}>
          {current == null ? (
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
              <AddSegment
                selectedColorIndex={selectedColorIndex}
                setSelectedColorIndex={setSelectedColorIndex}
                colorArray={colorArray}
                parent={parent}
                setParent={setParent}
                style={{ paddingHorizontal: PADDING_HORIZONTAL, flex: 1 }}
                handleCreate={handleCreate}
                dataIndex={dataIndex}
                current={current}
                handleDelete={handleDelete}
              />
              <AddSegment
                selectedColorIndex={selectedColorIndex}
                setSelectedColorIndex={setSelectedColorIndex}
                colorArray={colorArray}
                parent={parent}
                setParent={setParent}
                handleDelete={handleDelete}
                isProject={true}
                style={{ paddingHorizontal: PADDING_HORIZONTAL, flex: 1 }}
                handleCreate={handleCreate}
                dataIndex={dataIndex}
                current={current}
              />
            </SwitchWrapper>
          ) : (
            <AddSegment
              handleDelete={handleDelete}
              selectedColorIndex={selectedColorIndex}
              setSelectedColorIndex={setSelectedColorIndex}
              colorArray={colorArray}
              parent={parent}
              isProject={current.item.type === moduleType.project}
              setParent={setParent}
              style={{ paddingHorizontal: PADDING_HORIZONTAL, flex: 1 }}
              handleCreate={handleCreate}
              dataIndex={dataIndex}
              current={current}
              handleUpdate={handleUpdate}
              saveButtonPressed={saveButtonPressed}
              setSaveButtonPressed={setSaveButtonPressed}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

interface ContentProps {
  setSelectedColorIndex: (index: number) => void;
  colorArray: ColorPresets[];
  parent: DataIndexItem;
  setParent: (parent: DataIndexItem) => void;
  isProject?: boolean;
  style?: object;
  handleCreate: (data: AddQuery) => void;
  handleDelete: () => void;
  dataIndex: DataIndexLocal;
  current: DataIndexItem | null;
  handleUpdate?: (data: AddQuery) => void;
  saveButtonPressed?: boolean;
  setSaveButtonPressed?: (pressed: boolean) => void;
}

function AddSegment({
  selectedColorIndex,
  setSelectedColorIndex,
  colorArray,
  parent,
  setParent,
  isProject = false,
  style = {},
  handleCreate,
  handleDelete,
  dataIndex,
  current,
  handleUpdate,
  saveButtonPressed,
  setSaveButtonPressed,
}: ContentProps & { selectedColorIndex: number }) {
  const styles = useStyles();
  const [moduleNameState, setModuleNameState] = useState(
    current ? current.item.title : "",
  );
  const moduleName =
    moduleNameState || (isProject ? "New Project" : "New Activity");
  const [lapName, setLapName] = useState(current ? current.item.lapName : "");

  const dataIndexItem = dataIndex.get(parent.item.id) || null;

  if (!dataIndexItem) {
    return null;
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={[
        {
          marginHorizontal: -styles.innerAddScreen.paddingHorizontal,
          paddingHorizontal: styles.innerAddScreen.paddingHorizontal,
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.content, { paddingTop: current == null ? 16 : 10 }]}
        onPress={Keyboard.dismiss}
      >
        {!isProject ? (
          <ActivityAddContent
            current={current}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            colorArray={colorArray}
            parent={parent}
            setParent={setParent}
            moduleName={moduleName}
            setModuleName={setModuleNameState}
            lapName={lapName}
            setLapName={setLapName}
            dataIndex={dataIndex}
            handleCreate={handleCreate}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            saveButtonPressed={saveButtonPressed}
            setSaveButtonPressed={setSaveButtonPressed}
          />
        ) : (
          <ProjectAddContent
            current={current}
            projectColor={dataIndexItem.item.colorPreset}
            setSelectedColorIndex={setSelectedColorIndex}
            colorArray={colorArray}
            parent={parent}
            dataIndex={dataIndex}
            setParent={setParent}
            moduleName={moduleName}
            setModuleName={setModuleNameState}
            lapName={lapName}
            setLapName={setLapName}
            handleCreate={handleCreate}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            saveButtonPressed={saveButtonPressed}
            setSaveButtonPressed={setSaveButtonPressed}
          />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

interface AdditionalContentProps {
  moduleName: string;
  setModuleName: (name: string) => void;
  lapName: string;
  setLapName: (name: string) => void;
}

function ActivityAddContent({
  selectedColorIndex,
  setSelectedColorIndex,
  colorArray,
  parent,
  setParent,
  moduleName,
  setModuleName,
  setLapName,
  lapName,
  handleCreate,
  dataIndex,
  handleDelete,
  current,
  handleUpdate,
  saveButtonPressed,
  setSaveButtonPressed,
}: ContentProps & AdditionalContentProps & { selectedColorIndex: number }) {
  const styles = useStyles();
  const dataIndexItem = dataIndex.get(parent.item.id) || null;
  if (!dataIndexItem) {
    return null;
  }
  const [productivity, setProductivity] = useState<boolean>(
    current?.item.productive || dataIndexItem?.item.productive,
  );
  const { theme } = useTheme();

  useEffect(() => {
    if (
      saveButtonPressed &&
      setSaveButtonPressed !== undefined &&
      handleUpdate !== undefined
    ) {
      handleUpdate({
        type: moduleType.activity,
        title: moduleName,
        colorPreset: colorArray[selectedColorIndex],
        lapName: lapName,
        parentId: parent.item.id,
        productive: productivity,
      });
      setSaveButtonPressed(false);
    }
  }, [
    saveButtonPressed,
    setSaveButtonPressed,
    handleUpdate,
    parent,
    productivity,
    selectedColorIndex,
    lapName,
    moduleName,
    colorArray,
  ]);

  return (
    <>
      <TextField
        placeholder="Activity Name"
        startingText={moduleName}
        setModuleName={setModuleName}
        defaultText={current?.item.title || "Activity Name"}
        rightHint={true}
      />
      <Picker
        buttons={
          current == null
            ? [
                {
                  text: "Productive",
                  onPress: () => {
                    setProductivity(true);
                  },
                },
                {
                  text: "Unproductive",
                  onPress: () => {
                    setProductivity(false);
                  },
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
      <TextField
        placeholder="Lap Name"
        setModuleName={setLapName}
        rightHint={true}
        startingText={lapName}
        defaultText={current?.item.lapName || parent.item.lapName || "Lap"}
      />

      <ColorPicker
        colorPresets={colorArray}
        selectedColorIndex={selectedColorIndex}
        setSelectedColorIndex={setSelectedColorIndex}
      />
      <PathPicker
        parent={parent}
        setParent={setParent}
        moduleColorPallete={colorArray[selectedColorIndex]}
        moduleName={moduleName}
        isProject={false}
        dataIndex={dataIndex}
      />
      {current == null ? (
        <View style={styles.buttonProjectOuter}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleCreate({
                type: moduleType.activity,
                title: moduleName,
                colorPreset: colorArray[selectedColorIndex],
                lapName: lapName,
                parentId: parent.item.id,
                productive: productivity,
              });
            }}
          >
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonProjectOuter}>
          <TouchableOpacity
            style={styles.buttonProject}
            onPress={() => {
              handleDelete();
            }}
          >
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
    </>
  );
}

function ProjectAddContent({
  projectColor,
  colorArray,
  parent,
  setParent,
  moduleName,
  setModuleName,
  lapName,
  setLapName,
  handleCreate,
  dataIndex,
  handleDelete,
  current,
  handleUpdate,
  saveButtonPressed,
  setSaveButtonPressed,
}: ContentProps & AdditionalContentProps & { projectColor: ColorPresets }) {
  const styles = useStyles();

  const dataIndexItem = dataIndex.get(parent.item.id) || null;
  if (!dataIndexItem) {
    return null;
  }

  const productivity = dataIndexItem.item.productive;
  const { theme } = useTheme();

  useEffect(() => {
    if (
      saveButtonPressed &&
      setSaveButtonPressed !== undefined &&
      handleUpdate !== undefined
    ) {
      handleUpdate({
        type: moduleType.activity,
        title: moduleName,
        colorPreset: projectColor,
        lapName: lapName,
        parentId: parent.item.id,
        productive: productivity,
      });
      setSaveButtonPressed(false);
    }
  }, [
    saveButtonPressed,
    setSaveButtonPressed,
    handleUpdate,
    parent,
    productivity,
    projectColor,
    lapName,
    moduleName,
  ]);

  return (
    <>
      <TextField
        placeholder="Project Name"
        defaultText={current ? current.item.title : "Project Name"}
        startingText={current ? current.item.title : ""}
        setModuleName={setModuleName}
        rightHint={true}
      />
      <Picker
        buttons={[
          {
            text: productivity ? "Productive" : "Unproductive",
            onPress: () => {},
          },
        ]}
      />

      <TextField
        placeholder={current ? current.item.lapName : "Lap Name"}
        setModuleName={setLapName}
        rightHint={true}
        startingText={current ? current.item.lapName : ""}
        defaultText={current?.item.lapName || parent.item.lapName || "Lap"}
      />
      <PathPicker
        parent={parent}
        setParent={setParent}
        moduleColorPallete={projectColor}
        isProject={true}
        moduleName={moduleName}
        dataIndex={dataIndex}
      />
      {current == null ? (
        <View style={styles.buttonProjectOuter}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleCreate({
                type: moduleType.project,
                title: moduleName,
                colorPreset: projectColor,
                lapName: lapName,
                parentId: parent.item.id,
                productive: parent.item.productive,
              });
            }}
          >
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonProjectOuter}>
          <TouchableOpacity
            style={styles.buttonProject}
            onPress={() => {
              handleDelete();
            }}
          >
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
    </>
  );
}
