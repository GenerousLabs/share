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
import { RootState } from "../../services/store/store.service";
import Browse from "../Browse/Browse.scene";
import Connections from "../Connections/Connections.scene";
import Home from "../Home/Home.scene";
import Libraries from "../Libraries/Libraries.scene";
import NotFoundScreen from "../NotFound/NotFound.scene";
import Offers from "../Offers/Offers.scene";
import Settings from "../Settings/Settings.scene";
import Setup from "../Setup/Setup.scene";
import YourStuff from "../YourStuff/YourStuff.scene";
import BottomTabNavigator from "./scenes/BottomTabNavigator/BottomTabNavigator.scene";

const Drawer = createDrawerNavigator();

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
const Navigation = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
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
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isSetupComplete ? (
        <Drawer.Navigator
          initialRouteName="Home"
          // drawerContent={({ navigation }) => (
          //   <View>
          //     <Button
          //       title="Drawer"
          //       onPress={() => navigation.navigate("Libraries")}
          //     />
          //   </View>
          // )}
        >
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Browse" component={Browse} />
          <Drawer.Screen name="Your Stuff" component={YourStuff} />
          <Drawer.Screen name="Connections" component={Connections} />
          <Drawer.Screen name="Libraries" component={Libraries} />
          <Drawer.Screen name="Offers" component={Offers} />
          <Drawer.Screen name="Root" component={BottomTabNavigator} />
          <Drawer.Screen name="Settings" component={Settings} />
          <Drawer.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
        </Drawer.Navigator>
      ) : (
        <Drawer.Navigator initialRouteName="Setup">
          <Drawer.Screen name="Setup" component={Setup} />
          <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
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
