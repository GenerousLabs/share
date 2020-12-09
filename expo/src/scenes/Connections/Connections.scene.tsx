import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Header, ListItem, Overlay, Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { selectAllConnections } from "../../services/connection/connection.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import { ConnectionInRedux, RootStackParamList } from "../../shared.types";
import Invite from "./scenes/Invite/Invite.scene";

const log = rootLogger.extend("Connections");

const Connections = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootStackParamList, "Connections">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
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
        <Text h1>Connections</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title="Invite a friend"
          style={styles.actionButton}
          containerStyle={styles.buttonContainer}
          onPress={() => {
            setIsOverlayVisible(true);
          }}
        />
        <Button
          title="Accept an invite"
          style={styles.actionButton}
          containerStyle={styles.buttonContainer}
          onPress={() => {
            setIsOverlayVisible(true);
          }}
        />
      </View>
      <Overlay
        overlayStyle={styles.overlay}
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
      >
        <Invite />
      </Overlay>
      <View>
        <FlatList data={connections} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default Connections;

const styles = StyleSheet.create({
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  actionButton: {},
  overlay: {
    width: "80%",
    height: "90%",
  },
});
