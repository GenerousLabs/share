import { AsyncStorage } from "react-native";

// NOTE: We put this into a separate file as we need to require it from multiple
// places, and this avoids having a circular depenency.
export const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  version: 1,
};
