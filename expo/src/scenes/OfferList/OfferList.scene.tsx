import React from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { colours } from "../../root.theme";
import { rootLogger } from "../../services/log/log.service";
import { sharedStyles } from "../../shared.styles";
import { EnhancedOffer } from "../../shared.types";
import OfferSingle from "./components/OfferSingle/OfferSingle.component";

const log = rootLogger.extend("OfferList");

const renderItem = ({ item }: { item: EnhancedOffer }) => (
  <OfferSingle enhancedOffer={item} />
);

const OfferList = ({ enhancedOffers }: { enhancedOffers: EnhancedOffer[] }) => {
  return (
    <FlatList
      data={enhancedOffers}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListFooterComponent={View}
      ListFooterComponentStyle={styles.ScrollViewInner}
    />
  );
};

export default OfferList;

const styles = StyleSheet.create({
  ...sharedStyles,
  separator: {
    borderTopWidth: 1,
    borderTopColor: colours.grey5,
    marginVertical: 24,
  },
});
