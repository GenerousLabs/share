import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { makeSelectConnectionById } from "../../../../services/connection/connection.state";
import { sharedStyles } from "../../../../shared.styles";
import { ConnectionsStackParameterList } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";
import Confirm from "../Confirm/Confirm.scene";

const ConnectionsSingle = ({
  route,
  navigation,
}: {
  route: RouteProp<ConnectionsStackParameterList, "ConnectionsSingle">;
  navigation: StackNavigationProp<
    ConnectionsStackParameterList,
    "ConnectionsHome"
  >;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { connectionId } = route.params;
  const selector = useMemo(() => makeSelectConnectionById(connectionId), [
    connectionId,
  ]);
  const connection = useSelector(selector);

  if (typeof connection === "undefined") {
    return (
      <View>
        <Header title="Connection" goBack={navigation.goBack} />
        <Text>Loading</Text>
      </View>
    );
  }

  const isConfirmed = typeof connection.theirRepoId === "string";

  if (!isConfirmed) {
    return <Confirm connectionId={connectionId} goBack={navigation.goBack} />;
  }

  return (
    <View>
      <Header title={connection.name} goBack={navigation.goBack} />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
          <Text>Messaging is coming soon...</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ConnectionsSingle;

const styles = StyleSheet.create({
  ...sharedStyles,
});
