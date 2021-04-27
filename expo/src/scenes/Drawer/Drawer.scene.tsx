import { DrawerNavigationProp } from "@react-navigation/drawer";
import Constants from "expo-constants";
import React, { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { colours, montserrat, montserratBold } from "../../root.theme";
import { RootDrawerParamList, SetupDrawerParamList } from "../../shared.types";

const SETTINGS_TAP_COUNT = 3;
const MINIMUM_TAP_INTERVAL_MS = 800;

const version = Constants?.manifest?.extra?.commitHash || "DEV";
const slug = Constants?.manifest?.slug || "uknown-slug";

export enum DrawerType {
  setup,
  normal,
}

type MenuItem = {
  route: keyof RootDrawerParamList | keyof SetupDrawerParamList;
  title: string;
  subtitle: string;
};
const normalMenuItems: MenuItem[] = [
  {
    route: "Browse",
    title: "Browse list",
    subtitle: "Browse all that is shared with you from your community.",
  },
  {
    route: "YourStuff",
    title: "Your stuff",
    subtitle:
      "Manage your personal collections and define what you share with your community.",
  },
  {
    route: "Connections",
    title: "Your Community",
    subtitle: "Build your trusted community. Invite new friends to share with.",
  },
];

const setupMenuItems: MenuItem[] = [
  {
    route: "Setup",
    title: "Setup",
    subtitle:
      "Complete the (admittedly arduous) setup process to get started building your personal sharing community.",
  },
];

const MenuItem = ({
  route,
  subtitle,
  title,
  navigation,
}: {
  route: keyof RootDrawerParamList | keyof SetupDrawerParamList;
  title: string;
  subtitle: string;
  navigation:
    | DrawerNavigationProp<RootDrawerParamList>
    | DrawerNavigationProp<SetupDrawerParamList>;
}) => (
  <Pressable
    style={styles.menuItem}
    onPress={() => {
      // TODO Navigate to the first screen within the drawer if it has a navigator
      (navigation.navigate as any)(route);
      // NOTE: I've casted the type of navigate to any here because TypeScript
      // doesn't know which of the two drawer navigators we're going to have
      // available, and so it can't know if the `route` param is correct or not.
    }}
  >
    <View>
      <Text style={styles.menuItemTitle}>{title}</Text>
      <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
    </View>
  </Pressable>
);

const DrawerScene = ({
  navigation,
  type = DrawerType.normal,
}: {
  // navigation: DrawerNavigationProp<DrawerParamList>;
  navigation: any;
  type?: DrawerType;
}) => {
  const [settingsTapState, setSettingsTapState] = useState({
    tapCount: 0,
    lastTapTime: 0,
  });

  const handleSettingsTap = useCallback(() => {
    const lastTapTime = Date.now();
    const tapCount = settingsTapState.tapCount + 1;

    const timeSinceLastTap = lastTapTime - settingsTapState.lastTapTime;
    const wasARepeatedTap = timeSinceLastTap < MINIMUM_TAP_INTERVAL_MS;

    if (!wasARepeatedTap) {
      setSettingsTapState({ tapCount: 1, lastTapTime });
      return;
    }

    if (tapCount >= SETTINGS_TAP_COUNT) {
      navigation.navigate("Settings");
      setSettingsTapState({ tapCount: 0, lastTapTime: 0 });
      return;
    }

    setSettingsTapState({ tapCount, lastTapTime });
  }, [settingsTapState, setSettingsTapState, navigation]);

  const menuItems =
    type === DrawerType.setup ? setupMenuItems : normalMenuItems;

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <View style={styles.logoWrapper}>
            <TouchableOpacity onPress={handleSettingsTap}>
              <Image
                style={styles.logo}
                source={require("../../../assets/images/drawerLogo.png")}
              />
            </TouchableOpacity>
            {__DEV__ ? (
              <Text style={{ color: "white", position: "absolute", top: 160 }}>
                {slug}
              </Text>
            ) : null}
          </View>
          <View style={styles.menu}>
            {menuItems.map((item) => (
              <MenuItem key={item.route} navigation={navigation} {...item} />
            ))}
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>About Generous Labs</Text>
            <Text style={styles.footerBody}>
              Generous Labs is a purpose company. We make ethical software that
              supports human rights, democracy, and openness. Software that is
              designed to enable peer to peer cooperation. Humans connected
              directly together without intermediaries, surveillance or
              censorship. We believe this can lead to a radical transformation
              of human society.
              {"\n"}
              {"\n"}
              version: {version}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DrawerScene;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  innerContainer: {},
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.black,
    height: 200,
  },
  logo: {
    width: 56,
    height: 62,
  },
  menu: {
    padding: 24,
  },
  menuItem: { flex: 1 },
  menuItemTitle: { fontSize: 16, fontFamily: montserratBold, marginBottom: 12 },
  menuItemSubtitle: { fontSize: 12, marginBottom: 24 },
  footer: {
    backgroundColor: colours.bggrey,
    padding: 24,
  },
  footerTitle: { fontSize: 16, fontFamily: montserratBold, marginBottom: 12 },
  footerBody: { fontSize: 12, fontFamily: montserrat, marginBottom: 12 },
});
