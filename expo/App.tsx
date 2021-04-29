import "react-native-gesture-handler";
import "./src/utils/monkeyPatches";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "react-native-elements";
import { PersistGate } from "redux-persist/integration/react";

import { theme, montserrat, montserratBold } from "./src/root.theme";
import Navigation from "./src/scenes/Navigation/Navigation.scene";
import store, {
  persistor,
  startSagas,
} from "./src/services/store/store.service";
import { initLogger } from "./src/services/log/log.service";

const loadFonts = async () => {
  const fontsPromise = Font.loadAsync({
    ...Ionicons.font,
    [montserrat]: require("./assets/fonts/Montserrat-Regular.ttf"),
    [montserratBold]: require("./assets/fonts/Montserrat-Bold.ttf"),
  });
};

const appLoad = async () => {
  await Promise.all([loadFonts(), initLogger()]);
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <AppLoading
        startAsync={appLoad}
        onFinish={() => {
          startSagas();
          setIsLoading(false);
        }}
        onError={console.error}
      />
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
