import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Header as RNEHeader } from "react-native-elements";
import { RootDrawerParamList } from "../../shared.types";

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
          const navState = navigation.dangerouslyGetState();
          if (navState.routeNames.includes("Home")) {
            navigation.navigate("Home");
          } else {
            // Do nothing when the user presses the home / help icon during setup?
          }
        },
      }}
    />
  );
};

export default Header;
