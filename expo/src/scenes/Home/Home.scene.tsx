import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import Header from "../../components/Header/Header.component";
import WIPMessage from "../../components/WIPMessage/WIPMessage.component";
import { rootLogger } from "../../services/log/log.service";
import { sharedStyles } from "../../shared.styles";
import { RootDrawerParamList } from "../../shared.types";

const log = rootLogger.extend("Home");

const Home = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Home">;
}) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <WIPMessage />
        <Text h2>Welcome</Text>
        <Text>Check the menu top left.</Text>
        <Text>
          We're still in the early testing phase, so all data will be deleted
          before we launch this version. Thanks for helping to test it. Let us
          know if you find any issues.
        </Text>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  ...sharedStyles,
});
