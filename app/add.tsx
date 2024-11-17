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
import { ColorPresets, DataIndexItem } from "@/constants/interfaces";
import { AdditionalProps } from "react-native-svg/lib/typescript/xml";
import SwitchWrapper from "@/components/basic/switchWrapper/switchWrapper";

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
          />
          <AddSegment
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            colorArray={colorArray}
            parent={parent}
            setParent={setParent}
            isProject={true}
            style={{ paddingHorizontal: PADDING_HORIZONTAL, flex: 1 }}
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
}

function AddSegment({
  selectedColorIndex,
  setSelectedColorIndex,
  colorArray,
  parent,
  setParent,
  isProject = false,
  style = {},
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
          />
        ) : (
          <ProjectAddContent
            projectColor={dataIndex["activity-1-1-1-1-1"].colorPreset}
            setSelectedColorIndex={setSelectedColorIndex}
            colorArray={colorArray}
            parent={parent}
            setParent={setParent}
            moduleName={moduleName}
            setModuleName={setModuleNameState}
            lapName={lapName}
            setLapName={setLapName}
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
}: ContentProps & AdditionalContentProps & { selectedColorIndex: number }) {
  const styles = useStyles();
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
            onPress: () => {},
          },
          {
            text: "Unproductive",
            onPress: () => {},
          },
        ]}
      />
      <TextField
        placeholder="Lap Name"
        setModuleName={setLapName}
        rightHint={true}
        defaultText={"Lap"}
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
        <TouchableOpacity style={styles.button}>
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
}: ContentProps & AdditionalContentProps & { projectColor: ColorPresets }) {
  const styles = useStyles();
  return (
    <>
      <TextField
        placeholder="Project Name"
        setModuleName={setModuleName}
        rightHint={true}
      />
      <PathPicker
        parent={parent}
        setParent={setParent}
        moduleColorPallete={projectColor}
        isProject={true}
        moduleName={moduleName}
      />
      <View style={styles.buttonProjectOuter}>
        <TouchableOpacity style={styles.buttonProject}>
          <Text style={styles.buttonTextProject}>Create</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
