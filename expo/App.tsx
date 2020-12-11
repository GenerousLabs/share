import "react-native-gesture-handler";
import "./src/utils/monkeyPatches";

import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "react-native-elements";
import { theme } from "./src/root.theme";

import useCachedResources from "./src/hooks/useCachedResources";
import Navigation from "./src/scenes/Navigation/Navigation.scene";
import store from "./src/services/store/store.service";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar />
          </SafeAreaProvider>
        </Provider>
      </ThemeProvider>
    );
  }
}
