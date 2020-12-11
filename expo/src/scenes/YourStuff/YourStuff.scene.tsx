import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { rootLogger } from "../../services/log/log.service";
import { RootDrawerParamList } from "../../shared.types";
import OfferForm from "./scenes/OfferForm/OfferForm.scene";
import OfferList from "./scenes/OfferList/OfferList.scene";

export const log = rootLogger.extend("YourStuff");

const YourStuffStackNavigator = createStackNavigator();

const YourStuff = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "YourStuff">;
}) => {
  return (
    <YourStuffStackNavigator.Navigator headerMode="none">
      <YourStuffStackNavigator.Screen name="OfferList" component={OfferList} />
      <YourStuffStackNavigator.Screen name="OfferForm" component={OfferForm} />
    </YourStuffStackNavigator.Navigator>
  );
};

export default YourStuff;
