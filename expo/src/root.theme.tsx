import { StyleProp, TextProps, TextStyle } from "react-native";
import { FullTheme } from "react-native-elements";

const white = "#fff";
const black = "#212121";
const bggrey = "#f1f1f1";

export const colours = {
  white,
  black,
  bggrey,
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
    style: normal,
    h1Style: bold,
    h2Style: bold,
    h3Style: bold,
    h4Style: bold,
  },
  Button: {
    titleStyle: bold,
  },
};
