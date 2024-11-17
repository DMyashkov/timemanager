import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import useStyles from "./addStyles";
import { useTheme } from "@context/ThemeContext";
import Switch from "@components/basic/switch/switch";
import TextField from "@/components/form/textField/textField";
import Picker from "@/components/form/picker/picker";
import ColorPicker from "@/components/form/colorPicker/colorPicker";
import { useState } from "react";
import { dataIndex } from "@/constants/exampleData";
import PathPicker from "@/components/form/pathPicker/pathPicker";
import { ColorPresets, type DataIndexItem } from "@/constants/interfaces";
import { AdditionalProps } from "react-native-svg/lib/typescript/xml";
import SwitchWrapper from "@/components/basic/switchWrapper/switchWrapper";
import { moduleType } from "@/constants/interfaces";

interface AddQuery {
  type: moduleType;
  title: string;
  colorPreset: ColorPresets;
  lapName: string;
  parentId: string;
  productive: boolean;
}

export default function AddScreen() {
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

  const handleCreate = (data: AddQuery) => {
    if (data.lapName === "") {
      data.lapName = dataIndex[data.parentId].item.lapName;
    }
    const jsonData = JSON.stringify(data, null, 2);
    console.log(jsonData);
  };

  const [parent, setParent] = useState(dataIndex["activity-1-1-1-1-1"]);
  const PADDING_HORIZONTAL = 22;
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={[styles.addScreen, { backgroundColor: "yellow" }]}
    >
      <View style={styles.innerAddScreen}>
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
          />
          <AddSegment
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            colorArray={colorArray}
            parent={parent}
            setParent={setParent}
            isProject={true}
            style={{ paddingHorizontal: PADDING_HORIZONTAL, flex: 1 }}
            handleCreate={handleCreate}
          />
        </SwitchWrapper>
      </View>
    </TouchableWithoutFeedback>
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
}: ContentProps & { selectedColorIndex: number }) {
  const styles = useStyles();
  const [moduleNameState, setModuleNameState] = useState("");
  const moduleName =
    moduleNameState || (isProject ? "New Project" : "New Activity");
  const [lapName, setLapName] = useState("");

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
        style={styles.content}
        onPress={Keyboard.dismiss}
      >
        {!isProject ? (
          <ActivityAddContent
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            colorArray={colorArray}
            parent={parent}
            setParent={setParent}
            moduleName={moduleName}
            setModuleName={setModuleNameState}
            lapName={lapName}
            setLapName={setLapName}
            handleCreate={handleCreate}
          />
        ) : (
          <ProjectAddContent
            projectColor={dataIndex["activity-1-1-1-1-1"].item.colorPreset}
            setSelectedColorIndex={setSelectedColorIndex}
            colorArray={colorArray}
            parent={parent}
            setParent={setParent}
            moduleName={moduleName}
            setModuleName={setModuleNameState}
            lapName={lapName}
            setLapName={setLapName}
            handleCreate={handleCreate}
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
}: ContentProps & AdditionalContentProps & { selectedColorIndex: number }) {
  const styles = useStyles();
  const [productivity, setProductivity] = useState<boolean>(true);
  return (
    <>
      <TextField
        placeholder="Activity Name"
        setModuleName={setModuleName}
        rightHint={true}
      />
      <Picker
        buttons={[
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
        ]}
      />
      <TextField
        placeholder="Lap Name"
        setModuleName={setLapName}
        rightHint={true}
        defaultText={parent.item.lapName || "Lap"}
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
      />
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
}: ContentProps & AdditionalContentProps & { projectColor: ColorPresets }) {
  const styles = useStyles();

  return (
    <>
      <TextField
        placeholder="Project Name"
        setModuleName={setModuleName}
        rightHint={true}
      />

      <TextField
        placeholder="Lap Name"
        setModuleName={setLapName}
        rightHint={true}
        defaultText={parent.item.lapName || "Lap"}
      />
      <PathPicker
        parent={parent}
        setParent={setParent}
        moduleColorPallete={projectColor}
        isProject={true}
        moduleName={moduleName}
      />
      <View style={styles.buttonProjectOuter}>
        <TouchableOpacity
          style={styles.buttonProject}
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
          <Text style={styles.buttonTextProject}>Create</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
