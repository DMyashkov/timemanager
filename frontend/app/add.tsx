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
import { ColorPresets, type DataIndexItem } from "@/constants/interfaces";
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
  parentId: string;
  productive: boolean;
}

import TrashCan from "@assets/icons/trash-can.svg";
import SysButton from "@/components/basic/blueSystemButton/blueSystemButton";

export default function AddScreen() {
  const {
    dataIndex: rawDataIndexParam,
    parentId,
    rawIsAddScreen,
  } = useLocalSearchParams();
  const isAddScreen = rawIsAddScreen === "true";
  const styles = useStyles();
  const { theme } = useTheme();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const colorArray = [
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

  const handleCreate = async (data: AddQuery) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      // Use the parent's lap name as default if data.lapName is empty
      const lapName = data.lapName || "Default Lap";

      // Convert the parentId to an integer (since it must be a PK)
      const parentId = Number.parseInt(data.parentId, 10);

      // Send the POST request to create a new tag
      const response = await axios.post("http://127.0.0.1:8000/api/tags/", {
        title: data.title,
        type: data.type === moduleType.activity ? "activity" : "project",
        parent: parentId, // Convert parentId to an integer
        color_preset: data.colorPreset,
        lap_name: lapName, // Ensure lap_name is not blank
        productive: data.productive,
      });

      console.log("Tag created successfully:", response.data);
      alert(`Tag Created: ${response.data.title}`);
    } catch (error) {
      console.error("Error creating tag:", error);
      if (axios.isAxiosError(error)) {
        console.log("API Error:", error.response?.data);
        alert(`Error: ${JSON.stringify(error.response?.data)}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleUpdate = async (data: AddQuery) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const parentId = Number.parseInt(data.parentId, 10);

      const response = await axios.put(
        `http://127.0.0.1:8000/api/tags/${parentId}/`,
        {
          title: data.title,
          type: data.type === moduleType.activity ? "activity" : "project",
          parent: parentId,
          color_preset: data.colorPreset,
          lap_name: data.lapName,
          productive: data.productive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Tag updated successfully:", response.data);
      alert(`Tag Updated: ${response.data.title}`);
    } catch (error) {
      console.error("Error updating tag:", error);
      if (axios.isAxiosError(error)) {
        console.log("API Error:", error.response?.data);
        alert(`Error: ${JSON.stringify(error.response?.data)}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // console.log("isAddScreen", isAddScreen);

  const [dataIndex, setDataIndex] = useState<Record<string, DataIndexItem>>({}); // 🛠️ Default to empty object
  const dataIndexParam = Array.isArray(rawDataIndexParam)
    ? rawDataIndexParam[0]
    : rawDataIndexParam;

  // 🛠️ Parse dataIndex only once on component load
  useEffect(() => {
    if (dataIndexParam) {
      try {
        const parsedDataIndex = JSON.parse(dataIndexParam);
        setDataIndex(parsedDataIndex);
      } catch (error) {
        console.error("Failed to parse dataIndex:", error);
      }
    }
  }, [dataIndexParam]);

  const [parent, setParent] = useState<DataIndexItem | null>(null); // 🛠️ Set to null initially
  const [current, setCurrent] = useState<DataIndexItem | null>(null);
  const currentId = !isAddScreen ? parentId : null;

  useEffect(() => {
    if (dataIndex && parentId) {
      if (isAddScreen) {
        setParent(dataIndex[parentId as string] || null);
        setCurrent(null);
      } else {
        const currentItem = dataIndex[parentId as string];

        setParent(
          dataIndex[currentItem?.path[currentItem.path.length - 1]] || null,
        );
        setCurrent(currentItem);
      }
    }
  }, [dataIndex, parentId, isAddScreen]);

  const PADDING_HORIZONTAL = 22;
  if (!parent) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  // console.log("current", current);
  // console.log("dataIndex", JSON.stringify(dataIndex, null, 2));

  const handleDelete = async () => {};
  const isProject = current?.item.type === moduleType.project;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: isAddScreen
            ? "Create Tag"
            : `Edit ${isProject ? "Project" : "Activity"}`,
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
  dataIndex: Record<string, DataIndexItem>;
  current: DataIndexItem | null;
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
}: ContentProps & { selectedColorIndex: number }) {
  const styles = useStyles();
  const [moduleNameState, setModuleNameState] = useState(
    current ? current.item.title : "",
  );
  const moduleName =
    moduleNameState || (isProject ? "New Project" : "New Activity");
  const [lapName, setLapName] = useState(current ? current.item.lapName : "");

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
          />
        ) : (
          <ProjectAddContent
            current={current}
            projectColor={dataIndex[parent.item.id].item.colorPreset}
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
}: ContentProps & AdditionalContentProps & { selectedColorIndex: number }) {
  const styles = useStyles();
  const [productivity, setProductivity] = useState<boolean>(
    current?.item.productive || dataIndex[parent.item.id].item.productive,
  );
  const { theme } = useTheme();
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
}: ContentProps & AdditionalContentProps & { projectColor: ColorPresets }) {
  const styles = useStyles();
  const productivity = dataIndex[parent.item.id].item.productive;
  const { theme } = useTheme();

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
