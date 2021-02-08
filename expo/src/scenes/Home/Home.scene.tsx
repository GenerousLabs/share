import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import MarkdownRenderer from "react-native-markdown-display";
import Header from "../../components/Header/Header.component";
import Markdown from "../../components/Markdown/Markdown.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { rootLogger } from "../../services/log/log.service";
import { sharedStyles } from "../../shared.styles";
import { RootDrawerParamList } from "../../shared.types";

const log = rootLogger.extend("Home");

const md = `# Welcome

This app is very much a work in progress.

If you have issues, please reach out on the telegram group and we'll do our best to help.
`;

const Home = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Home">;
}) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <ScrollView>
          <WarningBox />
          <Markdown content={md} />
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  ...sharedStyles,
});
