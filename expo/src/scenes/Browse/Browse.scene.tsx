import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { reverse, sortBy } from "remeda";
import Header from "../../components/Header/Header.component";
import WIPMessage from "../../components/WIPMessage/WIPMessage.component";
import { selectAllImportedOffers } from "../../services/library/library.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import { sharedStyles } from "../../shared.styles";
import { RootDrawerParamList } from "../../shared.types";
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
    <View style={styles.container}>
      <Header title="Browse" />
      <View style={styles.contentContainer}>
        <WIPMessage />
        <View style={styles.FlatListWrapper}>
          <OfferList offers={sortedOffers} />
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
