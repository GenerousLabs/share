import { DrawerNavigationProp } from "@react-navigation/drawer";
import * as FileSystem from "expo-file-system";
import * as Updates from "expo-updates";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { colours } from "../../root.theme";
import {
  disableAllLogExtensions,
  enableAllLogExtensions,
} from "../../services/log/log.service";
import { selectAllRepos } from "../../services/repo/repo.state";
import { DANGEROUS_setupResetSagaAction } from "../../services/setup/setup.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { sharedStyles } from "../../shared.styles";
import { RootDrawerParamList } from "../../shared.types";
import { RootDispatch } from "../../store";

const Settings = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Settings">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const allRepos = useSelector(selectAllRepos);

  const allReposText = allRepos
    .map((repo) => `${repo.name}\n${repo.remoteUrl}`)
    .join("\n");
  const debuggingText = `Filesystem
documentDirectory: ${FileSystem.documentDirectory}
bundleDirectory: ${FileSystem.bundleDirectory}
cacheDirectory: ${FileSystem.cacheDirectory}

Repos
${allReposText}`;

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <View style={styles.contentContainer}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text h2>Here be dragons</Text>
          <WarningBox
            message="This app is a work in progress. This screen gives you access to the nuts and bolts. It's possible to break things here.  Please take a full backup before you mess with this."
            type="error"
          />
          <Button
            title="Reload the app"
            buttonStyle={styles.buttonBase}
            onPress={() => {
              Updates.reloadAsync();
            }}
          />
          <Button
            title="Open log view"
            buttonStyle={styles.buttonBase}
            onPress={() => navigation.navigate("Log")}
          />
          <Button
            title="Browse file system"
            buttonStyle={styles.buttonBase}
            onPress={() => navigation.navigate("BrowseFileSystem")}
          />
          <Button
            title="Enable debug logging"
            buttonStyle={styles.buttonBase}
            onPress={async () => {
              try {
                await enableAllLogExtensions();
                Alert.alert("Success", "Full debug logs are now enabled.");
              } catch (error) {
                Alert.alert("Error #OQAJtf", error.message);
              }
            }}
          />
          <Button
            title="Disable debug logging"
            buttonStyle={styles.buttonBase}
            onPress={async () => {
              try {
                await disableAllLogExtensions();
                Alert.alert("Success", "Full debug logs are now disabled.");
              } catch (error) {
                Alert.alert("Error #pgBbUb", error.message);
              }
            }}
          />
          <Button
            title="Export logs as zip"
            buttonStyle={[styles.buttonBase, styles.exportButton]}
            onPress={async () => {
              await createAndShareZipFile({ path: "/logs" });
              Alert.alert("Zip export finished #yVPYe9");
            }}
          />
          <Button
            title="Export repos as zip"
            buttonStyle={[styles.buttonBase, styles.exportButton]}
            onPress={async () => {
              await createAndShareZipFile({ path: "/repos" });
              Alert.alert("Zip export finished #znvf34");
            }}
          />
          <Button
            title="DANGEROUS reset the whole application"
            buttonStyle={[styles.buttonBase, styles.dangerButton]}
            titleStyle={styles.dangerButtonTitle}
            onPress={() => {
              Alert.alert(
                "DANGEROUS",
                "Are you sure you want to DELETE EVERYTHING FOREVER? There is absolutely NO UNDO.",
                [
                  {
                    text: "Yes",
                    onPress: () => dispatch(DANGEROUS_setupResetSagaAction()),
                  },
                  { text: "No" },
                ]
              );
            }}
          />
          <Text h2 style={styles.reposHeader}>
            Debugging
          </Text>
          <View style={styles.debugWarning}>
            <Text>
              WARNING: The following text contains passwords that allow access
              to your account. Only share this with somebody you trust.
            </Text>
          </View>
          <Input
            containerStyle={styles.debugInput}
            value={debuggingText}
            multiline
            selectTextOnFocus={true}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  ...sharedStyles,
  buttonBase: {
    marginVertical: 4,
    marginHorizontal: 24,
  },
  exportButton: {
    backgroundColor: "#0ec351",
  },
  dangerButton: {
    backgroundColor: "red",
  },
  dangerButtonTitle: {
    color: "black",
  },
  overlay: {
    // width: "80%",
    // height: "90%",
  },
  reposHeader: { marginTop: 40, marginBottom: 20 },
  debugWarning: {
    padding: 10,
    backgroundColor: "red",
    marginBottom: 20,
  },
  debugInput: {
    borderColor: colours.black,
    borderWidth: 1,
    padding: 5,
    // These need to be specified separately to override the theme defaults
    paddingLeft: 5,
    paddingRight: 5,
  },
});
