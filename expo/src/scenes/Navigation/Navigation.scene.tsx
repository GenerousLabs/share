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
import Home from "../Home/Home.scene";
import Libraries from "../Libraries/Libraries.scene";
import NotFoundScreen from "../NotFound/NotFound.scene";
import Offers from "../Offers/Offers.scene";
import BottomTabNavigator from "./scenes/BottomTabNavigator/BottomTabNavigator.scene";

export type RootStackParamList = {
  Home: undefined;
  Libraries: undefined;
  Offers: undefined;
  Root: undefined;
  NotFound: undefined;
};

const Drawer = createDrawerNavigator();

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
const Navigation = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  // NOTE: Typed this as `any` to stop TypeScript complainin
  const navigationRef: any = React.useRef();

  useReduxDevToolsExtension(navigationRef);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
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
        <Drawer.Screen name="Libraries" component={Libraries} />
        <Drawer.Screen name="Offers" component={Offers} />
        <Drawer.Screen name="Root" component={BottomTabNavigator} />
        <Drawer.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
      </Drawer.Navigator>
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
