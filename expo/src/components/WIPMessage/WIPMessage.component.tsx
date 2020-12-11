import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { colours } from "../../root.theme";

const WIPMessage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.wip}>
        This app is a work in progress. Please bear with us while we improve it.
      </Text>
    </View>
  );
};

export default WIPMessage;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.black,
    padding: 16,
    marginBottom: 40,
  },
  wip: {
    color: colours.white,
    fontSize: 12,
    // fontFamily
  },
});
