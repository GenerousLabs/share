import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { reverse, sortBy } from "remeda";
import Header from "../../components/Header/Header.component";
import WIPMessage from "../../components/WIPMessage/WIPMessage.component";
import { selectAllImportedOffers } from "../../services/library/library.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import { RootDrawerParamList, OfferInRedux } from "../../shared.types";
import OfferList from "../OfferList/OfferList.scene";

const log = rootLogger.extend("Browse");

const Browse = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Browse">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const offers = useSelector(selectAllImportedOffers);
  const sortedOffers = useMemo(
    () => reverse(sortBy(offers, (offer) => offer.updatedAt)),
    [offers]
  );

  return (
    <View>
      <Header title="Browse" />
      <WIPMessage />
      <OfferList offers={sortedOffers} />
    </View>
  );
};

export default Browse;

const styles = StyleSheet.create({
  // TODO Remove this after fixing ScrollViewHeight issue
  ScollViewInner: {
    paddingBottom: 200,
  },
});
