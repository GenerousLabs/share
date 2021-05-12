import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { useCallback } from "react";
import { Header as RNEHeader } from "react-native-elements";
import { colours } from "../../root.theme";
import { RootDrawerParamList } from "../../shared.types";

const getBackgroundColor = () => {
  if (__DEV__) {
    return "red";
  }
  if (Constants.manifest.extra?.environment === "staging") {
    return "purple";
  }
  return colours.white;
};

// This expands the touchable area of the icons without making them take up more
// space, 16px seems to stretch them to the same height as the header.
const iconStyle = {
  padding: 16,
  margin: -16,
};

const Header = ({ title, goBack }: { title?: string; goBack?: () => void }) => {
  const navigation: DrawerNavigationProp<
    RootDrawerParamList,
    "Settings"
  > = useNavigation();

  const goHome = useCallback(() => {
    try {
      navigation.navigate("Home");
    } catch (error) {
      // Do nothing when the user presses the home / help icon during setup?
    }
  }, [navigation]);

  const leftComponent =
    typeof goBack === "function"
      ? {
          icon: "navigate-before",
          onPress: goBack,
          iconStyle,
        }
      : {
          icon: "menu",
          onPress: () => {
            navigation.openDrawer();
          },
          iconStyle,
        };

  const rightComponent = {
    icon: "home",
    onPress: goHome,
    iconStyle,
  };

  return (
    <RNEHeader
      leftComponent={leftComponent}
      placement="left"
      centerComponent={{
        text: title || Constants.manifest.name || "Generous Share",
      }}
      rightComponent={rightComponent}
      backgroundColor={getBackgroundColor()}
    />
  );
};

export default Header;
