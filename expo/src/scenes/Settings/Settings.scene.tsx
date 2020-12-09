import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header.component";
import { DANGEROUS_setupResetSagaAction } from "../../services/setup/setup.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { DrawerParamList } from "../../shared.types";
import { RootDispatch } from "../../store";

const Settings = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<DrawerParamList, "Settings">;
}) => {
  const dispatch: RootDispatch = useDispatch();

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
});
