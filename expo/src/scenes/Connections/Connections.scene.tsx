import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Header, ListItem } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { selectAllConnections } from "../../services/connection/connection.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import { ConnectionInRedux, RootStackParamList } from "../../shared.types";

const log = rootLogger.extend("Connections");

const Connections = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootStackParamList, "Connections">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const connections = useSelector(selectAllConnections);

  const renderItem = useCallback(
    ({ item: connection }: { item: ConnectionInRedux }) => {
      return (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{connection.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      );
    },
    []
  );

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
        <FlatList data={connections} renderItem={renderItem} />
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
