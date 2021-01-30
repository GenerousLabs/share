import AsyncStorage from "@react-native-async-storage/async-storage";

// NOTE: We put this into a separate file as we need to require it from multiple
// places, and this avoids having a circular depenency.
export const persistConfig = {
  // Add a 10s timeout to help with slow starts while remotely debugging JS
  timeout: __DEV__ ? 10e3 : 1e3,
  key: "root",
  storage: AsyncStorage,
  version: 1,
};
