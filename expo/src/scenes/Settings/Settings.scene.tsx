import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Alert, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header.component";
import { DANGEROUS_setupResetSagaAction } from "../../services/setup/setup.state";
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
          title="DANGEROUS reset the whole application"
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
