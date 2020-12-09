import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, ListItem, Overlay, Text } from "react-native-elements";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header.component";
import { selectAllConnections } from "../../services/connection/connection.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import { ConnectionInRedux, DrawerParamList } from "../../shared.types";
import Invite from "./scenes/Invite/Invite.scene";

const log = rootLogger.extend("Connections");

const Connections = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<DrawerParamList, "Connections">;
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
      <Header />
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
        <ScrollView>
          <Invite />
        </ScrollView>
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
