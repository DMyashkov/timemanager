import { StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useSQLiteContext } from "@contexts/SQLiteContext";
import { useMemo } from "react";
import { useEffect } from "react";
import { drizzle } from "drizzle-orm";
import { getTag } from "@lib/tags";

export default function useStyles() {
  const { theme } = useTheme();
  const HIT_SLOP_TEXT_INPUT = 10;
  const SEND_BUTTON_SIZE = 34;

  const expoDb = useSQLiteContext();
  const db = useMemo(() => drizzle(expoDb, { schema }), [expoDb]);

  return StyleSheet.create({
    contentContainer: {
      flex: 1,
      paddingHorizontal: 22,
    },

    titleInput: {
      fontSize: theme.fontSize.largeSmall + 1,
      fontFamily: theme.font.regular,
      color: theme.color.black,
      width: "100%",
      paddingTop: HIT_SLOP_TEXT_INPUT,
      paddingBottom: HIT_SLOP_TEXT_INPUT,
    },
    titleContainer: {
      flexDirection: "column",
      width: "100%",
      marginTop: -HIT_SLOP_TEXT_INPUT,
      marginBottom: -HIT_SLOP_TEXT_INPUT,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    description: {
      fontSize: theme.fontSize.mediumSmall,
      fontFamily: theme.font.regular,
      color: theme.color.black,
      textAlignVertical: "top",
      marginTop: -HIT_SLOP_TEXT_INPUT / 2,
      paddingTop: HIT_SLOP_TEXT_INPUT / 2,
      marginBottom: -HIT_SLOP_TEXT_INPUT,
      paddingBottom: HIT_SLOP_TEXT_INPUT,
    },
    footer: {
      height: 55,
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 22,
      borderTopWidth: 0.5,
      borderColor: theme.color.lightGrey,
      justifyContent: "space-between",
    },
    outer: {
      flex: 1,
      gap: 10,
    },
    changeActivityButton: {
      borderRadius: theme.borderRadius.medium,
      borderWidth: 0.5,
      borderColor: theme.color.extraLightGrey,
      height: 35,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      gap: 5,
    },
    textInsideChangeActivityButton: {
      fontSize: theme.fontSize.small,
      fontFamily: theme.font.regular,
    },
    sendButton: {
      width: SEND_BUTTON_SIZE,
      aspectRatio: 1,
      backgroundColor: theme.color.red,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: SEND_BUTTON_SIZE / 2,
    },
    contentInner: {},
    buttonView: {
      flexDirection: "row",
      gap: 11,
    },
    firstRow: {
      flexDirection: "row",
      gap: 7,
      alignItems: "center",
    },
    checkMark: {
      height: 23,
      aspectRatio: 1,
      backgroundColor: theme.color.veryLightRed,
      borderColor: theme.color.darkRed,
      borderWidth: 2.3,
      borderRadius: 2.5,
      margin: 1,
    },
    row: {
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      paddingVertical: 13,
    },
    iconOuter: {
      width: 24,
      height: "100%",
      alignItems: "center",
    },
    wrapDescription: {
      flex: 1,
      justifyContent: "center",
    },
    separator: {
      height: 1,
      width: "100%",
      backgroundColor: theme.color.lightGrey,
    },
    dateText: {
      fontSize: theme.fontSize.mediumSmall,
      fontFamily: theme.font.regular,
      color: theme.color.black,
    },
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignItems: "center",
      rowGap: 7,
      columnGap: 5,
    },
    bigSeparator: {
      height: 7,
      backgroundColor: theme.color.defGrey,
      width: "200%",
      marginLeft: -22,
      marginTop: 14,
    },
  });
}
