import React from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { rootLogger } from "../../services/log/log.service";
import { OfferInRedux } from "../../shared.types";
import OfferSingle from "./components/OfferSingle/OfferSingle.component";

const log = rootLogger.extend("OfferList");

const renderItem = ({ item: offer }: { item: OfferInRedux }) => (
  <OfferSingle offer={offer} />
);

const OfferList = ({ offers }: { offers: OfferInRedux[] }) => {
  return (
    <FlatList
      data={offers}
      renderItem={renderItem}
      ListFooterComponent={View}
      ListFooterComponentStyle={styles.ScollViewInner}
    />
  );
};

export default OfferList;

const styles = StyleSheet.create({
  // TODO Remove this after fixing ScrollViewHeight issue
  ScollViewInner: {
    paddingBottom: 200,
  },
});
