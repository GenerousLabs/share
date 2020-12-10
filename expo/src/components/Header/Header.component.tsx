import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Header as RNEHeader } from "react-native-elements";
import { DrawerParamList } from "../../shared.types";

const Header = () => {
  const navigation: DrawerNavigationProp<
    DrawerParamList,
    "Settings"
  > = useNavigation();

  return (
    <RNEHeader
      leftComponent={{
        icon: "menu",
        onPress: () => {
          navigation.openDrawer();
        },
      }}
      placement="left"
      centerComponent={{
        text: "Generous Share",
      }}
      rightComponent={{
        icon: "settings",
        onPress: () => {
          // Typing here doesn't seem to know that Settings is in both possible
          // types, so cast to any.
          (navigation as any).navigate("Settings");
        },
      }}
    />
  );
};

export default Header;
