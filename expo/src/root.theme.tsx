import { StyleProp, TextProps, TextStyle } from "react-native";
import { FullTheme } from "react-native-elements";

const white = "#fff";
const black = "#212121";
const bggrey = "#f1f1f1";
const grey5 = "#c4c4c4";

export const colours = {
  white,
  black,
  bggrey,
  grey5,
};

export const montserrat = "montserrat" as const;
export const montserratBold = "montserrat-bold" as const;

const normal: StyleProp<TextStyle> = {
  fontWeight: "normal",
  fontFamily: montserrat,
};
const bold = {
  ...normal,
  fontFamily: montserratBold,
};

export const theme: Partial<FullTheme> = {
  CheckBox: {
    containerStyle: {
      borderColor: colours.white,
      backgroundColor: colours.white,
      // NOTE: These need to be explicity otherwise they get overwritten
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    textStyle: {
      ...normal,
      fontSize: 14,
    },
    fontFamily: montserrat,
  },
  Input: {
    labelStyle: normal,
    containerStyle: {
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    style: normal,
  },
  Header: {
    leftComponent: {
      style: {
        color: black,
      },
    },
    backgroundColor: colours.white,
    centerComponent: {
      style: {
        color: black,
        ...bold,
      },
    },
    rightComponent: {
      style: {
        color: black,
      },
    },
  },
  Text: {
    style: { ...normal, fontSize: 14 },
    h1Style: bold,
    h2Style: bold,
    h3Style: { ...bold, fontSize: 16 },
    h4Style: bold,
  },
  Button: {
    type: "outline",
    buttonStyle: {
      borderColor: colours.black,
      borderWidth: 2,
    },
    titleStyle: {
      ...bold,
      color: colours.black,
      fontSize: 14,
    },
  },
  CardTitle: {
    style: { ...normal, textAlign: "left", marginBottom: 0 },
    h1Style: bold,
    h2Style: bold,
    h3Style: bold,
    h4Style: bold,
  },
};
