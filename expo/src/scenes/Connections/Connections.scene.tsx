import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Header } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOffers } from "../../services/library/library.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import { RootStackParamList } from "../../shared.types";

const log = rootLogger.extend("Connections");

const Connections = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootStackParamList, "Connections">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const offers = useSelector(selectAllOffers);

  return (
    <View>
      <Header
        leftComponent={{
          icon: "menu",
          color: "#fff",
          onPress: () => navigation.openDrawer(),
        }}
        centerComponent={{ text: "Browser", color: "#fff" }}
        rightComponent={{ icon: "home", color: "#fff" }}
      />
      <View>
        <Text style={styles.title}>Connections</Text>
      </View>
      <View>
        <FlatList
          data={offers}
          renderItem={(item) => (
            <View>
              <Text>{item.item.title}</Text>
              <Text>{item.item.bodyMarkdown}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Connections;

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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    marginVertical: 3,
    width: "60%",
  },
});
