import { StyleSheet } from "react-native";
import { FONTS } from "@/constants/fonts";

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  headerContentContainer: {
    flexDirection: "column",
  },
  titleContainer: {
    justifyContent: "center",
    paddingLeft: 20,
  },
  title: {
    fontSize: 25,
    fontFamily: FONTS.semibold,
  },
});

export default styles;
