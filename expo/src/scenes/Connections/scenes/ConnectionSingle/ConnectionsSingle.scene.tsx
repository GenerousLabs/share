import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { selectConnectionById } from "../../../../services/connection/connection.state";
import { ConnectionsStackParameterList } from "../../../../shared.types";
import { RootState } from "../../../../store";
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
  const { connectionId } = route.params;
  const connection = useSelector((state: RootState) =>
    selectConnectionById(state, connectionId)
  );

  if (typeof connection === "undefined") {
    return (
      <View>
        <Header title="Connection" goBack={navigation.goBack} />
        <Text>Loading</Text>
      </View>
    );
  }

  const confirmed = typeof connection.theirRepoId === "string";

  if (!confirmed) {
    return <Confirm connectionId={connectionId} goBack={navigation.goBack} />;
  }

  return (
    <View>
      <Header title={connection.name} goBack={navigation.goBack} />
      <Text>Coming in a second or six</Text>
    </View>
  );
};

export default ConnectionsSingle;
