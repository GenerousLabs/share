import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import { useSelector } from "react-redux";
import { colours } from "../../root.theme";
import { RootState } from "../../services/store/store.service";
import Browse from "../Browse/Browse.scene";
import Connections from "../Connections/Connections.scene";
import DrawerScene from "../Drawer/Drawer.scene";
import Home from "../Home/Home.scene";
import Libraries from "../Libraries/Libraries.scene";
import NotFoundScreen from "../NotFound/NotFound.scene";
import Offers from "../Offers/Offers.scene";
import Settings from "../Settings/Settings.scene";
import Setup from "../Setup/Setup.scene";
import YourStuff from "../YourStuff/YourStuff.scene";
import BottomTabNavigator from "./scenes/BottomTabNavigator/BottomTabNavigator.scene";

const DrawerNavigator = createDrawerNavigator();

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
const Navigation = () => {
  // NOTE: Typed this as `any` to stop TypeScript complainin
  const navigationRef: any = React.useRef();
  const isSetupComplete = useSelector(
    (state: RootState) => state.setup.isSetupComplete
  );

  useReduxDevToolsExtension(navigationRef);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      theme={{
        dark: false,
        colors: {
          background: colours.white,
          border: colours.white,
          card: colours.white,
          text: colours.black,
          notification: colours.black,
          primary: colours.black,
        },
      }}
      // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isSetupComplete ? (
        <DrawerNavigator.Navigator
          initialRouteName="Home"
          drawerContent={DrawerScene}
        >
          <DrawerNavigator.Screen name="Home" component={Home} />
          <DrawerNavigator.Screen name="Browse" component={Browse} />
          <DrawerNavigator.Screen name="YourStuff" component={YourStuff} />
          <DrawerNavigator.Screen name="Connections" component={Connections} />
          <DrawerNavigator.Screen name="Libraries" component={Libraries} />
          <DrawerNavigator.Screen name="Offers" component={Offers} />
          <DrawerNavigator.Screen name="Root" component={BottomTabNavigator} />
          <DrawerNavigator.Screen name="Settings" component={Settings} />
          <DrawerNavigator.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
        </DrawerNavigator.Navigator>
      ) : (
        <DrawerNavigator.Navigator initialRouteName="Setup">
          <DrawerNavigator.Screen name="Setup" component={Setup} />
          <DrawerNavigator.Screen name="Settings" component={Settings} />
        </DrawerNavigator.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;

export const LinkingConfiguration = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: "one",
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: "two",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
