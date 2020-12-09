import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Libraries" component={Libraries} />
      <Stack.Screen name="Offers" component={Offers} />
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

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
      <RootNavigator />
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
