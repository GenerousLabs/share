import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { colours, montserrat } from "../../root.theme";

const WarningBox = ({
  message,
  type = "wip",
}: {
  message?: string;
  type?: "wip" | "error";
}) => {
  const actualMessage =
    typeof message === "string"
      ? message
      : "This app is a work in progress. Please bear with us while we improve it.";

  const extraStyles = type === "wip" ? styles.wip : styles.error;

  // NOTE: We need to pass a single object to the `style` prop of `Text`. If
  // instead we pass an array of styles, this will override the styles set in
  // our theme.

  return (
    <View style={[styles.wrapper, extraStyles]}>
      <Text style={{ ...styles.message, ...extraStyles }}>{actualMessage}</Text>
    </View>
  );
};

export default WarningBox;

export const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    marginBottom: 40,
  },
  wip: {
    backgroundColor: colours.black,
    color: colours.white,
  },
  error: {
    backgroundColor: "red",
    color: colours.black,
  },
  message: {
    fontSize: 12,
  },
});
