import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Header as RNEHeader } from "react-native-elements";
import { colours } from "../../root.theme";
import { RootDrawerParamList } from "../../shared.types";

const getBackgroundColor = () => {
  if (__DEV__) {
    return "red";
  }
  if (process.env.NODE_ENV === "staging") {
    return "purple";
  }
  return colours.white;
};

const Header = ({ title, goBack }: { title?: string; goBack?: () => void }) => {
  const navigation: DrawerNavigationProp<
    RootDrawerParamList,
    "Settings"
  > = useNavigation();

  const leftComponent =
    typeof goBack === "function"
      ? {
          icon: "navigate-before",
          onPress: goBack,
        }
      : {
          icon: "menu",
          onPress: () => {
            navigation.openDrawer();
          },
        };

  return (
    <RNEHeader
      leftComponent={leftComponent}
      placement="left"
      centerComponent={{
        text: title || "Generous Share",
      }}
      rightComponent={{
        icon: "home",
        onPress: () => {
          try {
            navigation.navigate("Home");
          } catch (error) {
            // Do nothing when the user presses the home / help icon during setup?
          }
        },
      }}
      backgroundColor={getBackgroundColor()}
    />
  );
};

export default Header;
