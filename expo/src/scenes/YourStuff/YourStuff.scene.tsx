import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { colours } from "../../root.theme";
import { rootLogger } from "../../services/log/log.service";
import { RootDrawerParamList } from "../../shared.types";
import OfferForm from "./scenes/OfferForm/OfferForm.scene";
import YourStuffList from "./scenes/YourStuffList/YourStuffList.scene";

export const log = rootLogger.extend("YourStuff");

const YourStuffStackNavigator = createStackNavigator();

const YourStuff = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "YourStuff">;
}) => {
  return (
    <YourStuffStackNavigator.Navigator headerMode="none">
      <YourStuffStackNavigator.Screen
        name="YourStuffList"
        component={YourStuffList}
      />
      <YourStuffStackNavigator.Screen name="OfferForm" component={OfferForm} />
    </YourStuffStackNavigator.Navigator>
  );
};

export default YourStuff;
