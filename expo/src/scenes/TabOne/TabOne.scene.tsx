import { DrawerNavigationProp } from "@react-navigation/drawer";
import * as FileSystem from "expo-file-system";
import * as React from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header.component";
import { createNewOfferSagaAction } from "../../services/library/library.saga";
import { loadOfferSagaAction } from "../../services/library/library.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { RootDrawerParamList } from "../../shared.types";
import { RootDispatch } from "../../store";

(globalThis as any).FileSystem = FileSystem;

export default function TabOne({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Root">;
}) {
  const dispatch: RootDispatch = useDispatch();

  return (
    <View>
      <Header />
      <View>
        {/* <Button
          title="Create new repo"
          onPress={() => {
            dispatch(
              createRepoAction({
                repoId: "re2",
                title: "Testing repos",
                bodyMarkdown:
                  "This is a test repo.\n\n- A list\n- With two items\n\nAnd more text",
                path: "/re2/",
                uuid: "re2-uuid-example",
              })
            );
          }}
        /> */}
        <Button
          title="Create new asset"
          onPress={() => {
            dispatch(
              createNewOfferSagaAction({
                repoId: "re2",
                offer: {
                  bodyMarkdown: "A new offer",
                  proximity: 0,
                  shareToProximity: 1,
                  title: "An offer",
                  uuid: "uuid-example",
                  tags: [],
                },
              })
            );
          }}
        />
        <Button
          title="Load offer"
          onPress={() => {
            dispatch(
              loadOfferSagaAction({
                repoId: "re2",
                directoryPath: "/re2/doesnotexist/",
              })
            );
          }}
        />
        <Button
          title="Delete re2"
          onPress={async () => {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "re2/");
            Alert.alert("Done");
          }}
        />
        <Button
          title="Export re2 as zip"
          onPress={async () => {
            await createAndShareZipFile({ path: "/re2" });
            Alert.alert("Zip export finished #uuOdQ4");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
