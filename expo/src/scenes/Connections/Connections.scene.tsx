import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input, ListItem, Overlay, Text } from "react-native-elements";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header.component";
import { confirmConnectionSagaAction } from "../../services/connection/connection.saga";
import {
  ConnectionCodeType,
  getConnectionCode,
} from "../../services/connection/connection.service";
import { selectAllConnections } from "../../services/connection/connection.state";
import { rootLogger } from "../../services/log/log.service";
import { selectAllRepos, selectRepoById } from "../../services/repo/repo.state";
import { ConnectionInRedux, DrawerParamList } from "../../shared.types";
import { RootDispatch, RootState } from "../../store";
import Accept from "./scenes/Accept/Accept.scene";
import Invite from "./scenes/Invite/Invite.scene";

const log = rootLogger.extend("Connections");

enum InviteType {
  none = "none",
  invite = "invite",
  accept = "accept",
}

const Connections = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<DrawerParamList, "Connections">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const connections = useSelector(selectAllConnections);
  const repos = useSelector(selectAllRepos);
  const [inviteType, setInviteType] = useState(InviteType.none);
  const [connectionId, setConnectionId] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [code, setCode] = useState("");
  const connection = connections.find((c) => c.id === connectionId);
  const myRepo =
    typeof connection !== "undefined"
      ? repos.find((r) => r.id === connection.myRepoId)
      : undefined;

  // TODO Get the code from disk via a better method
  // NOTE: This is a pretty ugly way of getting data from disk, hopefully
  // there's a cleaner approach.
  useEffect(() => {
    if (typeof connection === "undefined" || typeof myRepo === "undefined") {
      return;
    }
    const type =
      typeof connection.theirRepoId === "undefined"
        ? ConnectionCodeType.INVITE
        : ConnectionCodeType.CONFIRM;
    getConnectionCode({ connection, repo: myRepo, type }).then((code) => {
      setCode(code);
    });
  }, [connection, myRepo]);

  const closeOverlay = useCallback(() => {
    setConnectionId("");
  }, []);

  const isOverlayVisible = connectionId !== "";

  const renderItem = useCallback(
    ({ item: connection }: { item: ConnectionInRedux }) => {
      const confirmed = typeof connection.theirRepoId === "string";
      return (
        <ListItem
          bottomDivider
          onPress={() => {
            if (confirmed) {
              return;
            }
            setConnectionId(connection.id);
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{connection.name}</ListItem.Title>
            <ListItem.Subtitle>
              {confirmed ? "Connected" : "Pending"}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
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
            setInviteType(InviteType.invite);
          }}
        />
        <Button
          title="Accept an invite"
          style={styles.actionButton}
          containerStyle={styles.buttonContainer}
          onPress={() => {
            setInviteType(InviteType.accept);
          }}
        />
      </View>
      <Overlay
        overlayStyle={styles.overlay}
        isVisible={inviteType !== InviteType.none}
        onBackdropPress={() => {
          setInviteType(InviteType.none);
        }}
      >
        <ScrollView>
          {inviteType === InviteType.invite ? <Invite /> : <Accept />}
        </ScrollView>
      </Overlay>
      <View>
        <FlatList data={connections} renderItem={renderItem} />
      </View>
      <Overlay
        overlayStyle={styles.overlay}
        isVisible={isOverlayVisible}
        fullScreen
        onBackdropPress={closeOverlay}
      >
        <ScrollView>
          <Text h2>{connection?.name}</Text>
          <Text>{connection?.notes}</Text>
          {code !== "" ? (
            <Input value={code} multiline numberOfLines={12} />
          ) : (
            <Text>Loading code</Text>
          )}
          <Text h2>Confirmation Code</Text>
          <Text>
            Once you receive the CONRIRM_ code back from your friend, paste it
            here
          </Text>
          <Input
            multiline
            numberOfLines={12}
            onChangeText={(value) => setConfirmCode(value)}
          />
          <Button
            title="Confirm"
            onPress={() => {
              if (confirmCode !== "") {
                dispatch(
                  confirmConnectionSagaAction({
                    connectionId,
                    confirmCode,
                  })
                );
              }
            }}
          />
        </ScrollView>
      </Overlay>
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
