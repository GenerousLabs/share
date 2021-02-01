import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Divider, Overlay, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { selectAllRepos } from "../../services/repo/repo.state";
import { DANGEROUS_setupResetSagaAction } from "../../services/setup/setup.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { sharedStyles } from "../../shared.styles";
import { RootDrawerParamList } from "../../shared.types";
import { RootDispatch, RootState } from "../../store";
import Log from "./scenes/Log/Log.scene";

const Settings = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Settings">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const allRepos = useSelector(selectAllRepos);

  const closeOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <View style={styles.contentContainer}>
        <ScrollView>
          <Text h2>Here be dragons</Text>
          <WarningBox
            message="This app is a work in progress. This screen gives you access to the nuts and bolts. It's possible to break things here.  Please take a full backup before you mess with this."
            type="error"
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
          <Button
            title="Open log view"
            buttonStyle={styles.buttonBase}
            onPress={() => setIsOverlayVisible(true)}
          />
          <Text h2>Repos</Text>
          {allRepos.map((repo) => (
            <View key={repo.id}>
              <Text>{repo.name}</Text>
              <Text>{repo.remoteUrl}</Text>
              <Divider />
            </View>
          ))}
          <Overlay
            overlayStyle={styles.overlay}
            isVisible={isOverlayVisible}
            fullScreen
            onBackdropPress={() => {
              setIsOverlayVisible(false);
            }}
          >
            <ScrollView>
              <Log closeOverlay={closeOverlay} />
            </ScrollView>
          </Overlay>
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
});
