import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createSelector } from "@reduxjs/toolkit";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import * as R from "remeda";
import Header from "../../components/Header/Header.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { selectAllEnhancedOffersWithAlternates } from "../../selectors/selectAllEnhancedOffersWithAlternates.selector";
import { isNotArchivedOffer } from "../../services/library/library.utils";
import { rootLogger } from "../../services/log/log.service";
import { sharedStyles } from "../../shared.styles";
import { RootDrawerParamList } from "../../shared.types";
import OfferList from "../OfferList/OfferList.scene";

const log = rootLogger.extend("Browse");

const selector = createSelector(
  [selectAllEnhancedOffersWithAlternates],
  (enhancedOffers) => {
    return R.pipe(
      enhancedOffers,
      R.filter(({ offer }) => !offer.mine && isNotArchivedOffer(offer)),
      R.sortBy((enhancedOffer) => enhancedOffer.offer.updatedAt),
      R.reverse()
    );
  }
);

const Browse = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Browse">;
}) => {
  const enhancedOffers = useSelector(selector);

  return (
    <View style={styles.container}>
      <Header title="Browse" />
      <View style={styles.contentContainer}>
        <WarningBox />
        <View style={styles.FlatListWrapper}>
          <OfferList enhancedOffers={enhancedOffers} />
        </View>
      </View>
    </View>
  );
};

export default Browse;

const styles = StyleSheet.create({
  // TODO Remove this after fixing ScrollViewHeight issue
  ...sharedStyles,
});
