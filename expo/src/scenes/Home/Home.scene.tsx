import { StackNavigationProp } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system";
import React from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { RootStackParamList } from "../../../types";
import { MonoText } from "../../components/StyledText";
import { createNewOfferSagaAction } from "../../services/library/library.state";
import { setupSagaAction } from "../../services/setup/setup.state";
import { startupSagaAction } from "../../services/startup/startup.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { RootDispatch } from "../../store";

const Home = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
}) => {
  const dispatch: RootDispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <MonoText>Welcome to Home</MonoText>
      </View>
      <View>
        <Button
          title="View offers"
          color="red"
          onPress={() => {
            navigation.navigate("Offers");
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
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
        <View style={styles.buttonWrapper}>
          <Button
            title="Run setup"
            onPress={async () => {
              dispatch(
                setupSagaAction({
                  config: {
                    remote: {
                      protocol: "http",
                      host: "192.168.178.59:8000",
                      token: "abc123",
                      username: "x4",
                    },
                  },
                })
              );
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Run startup"
            onPress={async () => {
              dispatch(startupSagaAction());
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Delete repos"
            onPress={async () => {
              await FileSystem.deleteAsync(
                FileSystem.documentDirectory + "repos/"
              );
              Alert.alert("Done");
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Create new asset"
            onPress={() => {
              dispatch(
                createNewOfferSagaAction({
                  offer: {
                    bodyMarkdown: "A new offer",
                    proximity: 0,
                    shareToProximity: 1,
                    title: "An offer",
                    uuid: "uuid-example",
                    tags: [],
                  },
                  repoId: "re2",
                })
              );
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Export re2 as zip"
            onPress={async () => {
              await createAndShareZipFile({ path: "/re2" });
              Alert.alert("Zip export finished #uuOdQ4");
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Export repos as zip"
            onPress={async () => {
              await createAndShareZipFile({ path: "/repos" });
              Alert.alert("Zip export finished #znvf34");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    alignContent: "center",
  },
  buttonWrapper: {
    marginVertical: 3,
    width: "60%",
  },
});
