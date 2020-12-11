import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Overlay, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header.component";
import { DANGEROUS_setupResetSagaAction } from "../../services/setup/setup.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { RootDrawerParamList } from "../../shared.types";
import { RootDispatch } from "../../store";
import Log from "./scenes/Log/Log.scene";

const Settings = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Settings">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const closeOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

  return (
    <View>
      <Header />
      <Text h1>Settings</Text>
      <View>
        <Button
          title="Export repos as zip"
          buttonStyle={styles.exportButton}
          onPress={async () => {
            await createAndShareZipFile({ path: "/repos" });
            Alert.alert("Zip export finished #znvf34");
          }}
        />
        <Button
          title="DANGEROUS reset the whole application"
          buttonStyle={styles.dangerButton}
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
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
        <Button title="Offers" onPress={() => navigation.navigate("Offers")} />
        <Button
          title="Open log view"
          onPress={() => setIsOverlayVisible(true)}
        />
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
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  exportButton: {
    backgroundColor: "#116530",
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
