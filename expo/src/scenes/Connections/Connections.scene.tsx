import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { colours } from "../../root.theme";
import { RootDrawerParamList } from "../../shared.types";
import Accept from "./scenes/Accept/Accept.scene";
import ConnectionsList from "./scenes/ConnectionList/ConnectionList.scene";
import ConnectionsSingle from "./scenes/ConnectionSingle/ConnectionsSingle.scene";
import Invite from "./scenes/Invite/Invite.scene";

const ConnectionsStackNavigator = createStackNavigator();

const Connections = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Connections">;
}) => {
  return (
    <ConnectionsStackNavigator.Navigator headerMode="none">
      <ConnectionsStackNavigator.Screen
        name="ConnectionsHome"
        component={ConnectionsList}
      />
      <ConnectionsStackNavigator.Screen
        name="ConnectionsInvite"
        component={Invite}
      />
      <ConnectionsStackNavigator.Screen
        name="ConnectionsAccept"
        component={Accept}
      />
      <ConnectionsStackNavigator.Screen
        name="ConnectionsSingle"
        component={ConnectionsSingle}
      />
    </ConnectionsStackNavigator.Navigator>
  );
};

export default Connections;
