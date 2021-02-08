import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import MarkdownRenderer from "react-native-markdown-display";
import Header from "../../components/Header/Header.component";
import Markdown from "../../components/Markdown/Markdown.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { rootLogger } from "../../services/log/log.service";
import { sharedStyles } from "../../shared.styles";
import { RootDrawerParamList } from "../../shared.types";

const log = rootLogger.extend("Home");

const md = `# A heading one

- A list
- another item

## Check the menu

> And a little blockquote

* Check the menu
* For **more**
* And _Check_

Check the menu`;

const Home = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Home">;
}) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <WarningBox />
        <Markdown content={md} />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  ...sharedStyles,
});
