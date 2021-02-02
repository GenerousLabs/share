import React from "react";
import { StyleSheet, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { colours } from "../../root.theme";

const RadioButtons = ({
  options,
  value,
  onChange,
}: {
  options: { title: string; value: string }[];
  value: string;
  onChange: (newValue: string) => void;
}) => {
  return (
    <View style={styles.wrapper}>
      {options.map((option) => (
        <CheckBox
          key={option.value}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={value === option.value}
          title={option.title}
          uncheckedColor={colours.grey5}
          checkedColor={colours.black}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.text}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
};

export default RadioButtons;

const styles = StyleSheet.create({
  wrapper: { marginVertical: 4 },
  checkboxContainer: {
    paddingVertical: 0,
    marginVertical: 3,
  },
  text: {
    textTransform: "uppercase",
  },
});
