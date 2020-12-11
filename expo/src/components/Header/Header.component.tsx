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
