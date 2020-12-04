import { StackNavigationProp } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system";
import React, { useEffect } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { RootStackParamList } from "../../navigation";
import {
  createNewOfferSagaAction,
  subscribeToLibrarySagaAction,
} from "../../services/library/library.state";
import { getLogs, rootLogger } from "../../services/log/log.service";
import {
  DANGEROUS_setupResetSagaAction,
  setupSagaAction,
} from "../../services/setup/setup.state";
import { startupSagaAction } from "../../services/startup/startup.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { RootDispatch } from "../../store";

const log = rootLogger.extend("Home");

const Home = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  useEffect(() => {
    log.debug("useEffect() #SiaYlJ");
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <Text style={styles.title}>Home</Text>
      </View>
      <View style={styles.navButtonWrapper}>
        <View style={styles.navButton}>
          <Button
            title="View libraries"
            color="green"
            onPress={() => {
              navigation.navigate("Libraries");
            }}
          />
        </View>
        <View style={styles.navButton}>
          <Button
            title="View offers"
            color="red"
            onPress={() => {
              navigation.navigate("Offers");
            }}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
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
            title="Import repo"
            onPress={async () => {
              dispatch(
                subscribeToLibrarySagaAction({
                  name: "First share",
                  keysBase64: {
                    content: "qSzejjkFB4r+MBwdsdhzSYehKroJfaeSsNPRWX+gNBY=",
                    filename: "pURKAQ2QvWu1P1jU5G7o09esDUElFJeYJyVQGRomjew=",
                    salt: "b5jwqunGcTra8Ud+gnxdWWfNClKAQ/XNGf6SMNZxoWg=",
                  },
                  remoteUrl:
                    "encrypted::http://192.168.178.59:8000/sh/shared.git",
                })
              );
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
            title="Export repos as zip"
            onPress={async () => {
              await createAndShareZipFile({ path: "/repos" });
              Alert.alert("Zip export finished #znvf34");
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            color="lightblue"
            title="Show logs"
            onPress={async () => {
              try {
                const logs = await getLogs();
                // NOTE: We don't use `log.()` here because we don't want to log
                // the logs again
                console.log("log #kP1xw6", logs);
                Alert.alert(`Log file`, logs);
              } catch (error) {
                log.error(error);
              }
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            color="grey"
            title="DANGEROUS reset the whole application"
            onPress={() => {
              dispatch(DANGEROUS_setupResetSagaAction());
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
  },
  navButtonWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  navButton: {
    flex: 1,
    paddingHorizontal: 6,
  },
  buttonContainer: {
    width: "100%",
    alignContent: "center",
  },
  buttonWrapper: {
    marginVertical: 3,
    width: "60%",
  },
});
