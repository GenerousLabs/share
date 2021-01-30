import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input, ListItem, Overlay, Text } from "react-native-elements";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { confirmConnectionSagaAction } from "../../../../services/connection/connection.saga";
import {
  ConnectionCodeType,
  getConnectionCode,
} from "../../../../services/connection/connection.service";
import {
  selectAllConnections,
  selectAllConnectionsWithLibraries,
} from "../../../../services/connection/connection.state";
import { selectAllRepos } from "../../../../services/repo/repo.state";
import { SCROLLVIEW_INNER_BOTTOM_PADDING } from "../../../../shared.constants";
import {
  ConnectionInRedux,
  ConnectionsStackParameterList,
  RepoInRedux,
} from "../../../../shared.types";
import { RootDispatch } from "../../../../store";
import { log as parentLogger } from "../../Connections.log";

const log = parentLogger.extend("ConnectionsList");

const ConnectionsList = ({
  navigation,
}: {
  navigation: StackNavigationProp<
    ConnectionsStackParameterList,
    "ConnectionsHome"
  >;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const connectionsWithLibraries = useSelector(
    selectAllConnectionsWithLibraries
  );

  const renderItem = useCallback(
    ({
      item: { connection, library },
    }: {
      item: { connection: ConnectionInRedux; library?: RepoInRedux };
    }) => {
      const confirmed = typeof connection.theirRepoId === "string";
      const connected = typeof library !== "undefined";
      const status = connected
        ? "Connected"
        : confirmed
        ? "Confirmed"
        : "Pending";
      return (
        <ListItem
          bottomDivider
          onPress={() => {
            navigation.navigate("ConnectionsSingle", {
              connectionId: connection.id,
            });
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{connection.name}</ListItem.Title>
            <ListItem.Subtitle>{status}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      );
    },
    [navigation]
  );

  return (
    <View>
      <Header title="Connections" />
      <View style={styles.buttonsContainer}>
        <Button
          title="Invite a friend"
          style={styles.actionButton}
          containerStyle={styles.buttonContainer}
          onPress={() => {
            navigation.navigate("ConnectionsInvite");
          }}
        />
        <Button
          title="Accept an invite"
          style={styles.actionButton}
          containerStyle={styles.buttonContainer}
          onPress={() => {
            navigation.navigate("ConnectionsAccept");
          }}
        />
      </View>
      <View>
        <FlatList
          data={connectionsWithLibraries}
          keyExtractor={(item) => item.connection.id}
          renderItem={renderItem}
          ListFooterComponent={View}
          ListFooterComponentStyle={styles.ScollViewInner}
        />
      </View>
    </View>
  );
};

export default ConnectionsList;

const styles = StyleSheet.create({
  // TODO Remove this after fixing ScrollViewHeight issue
  ScollViewInner: {
    paddingBottom: SCROLLVIEW_INNER_BOTTOM_PADDING,
  },
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
