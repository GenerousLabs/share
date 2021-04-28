import { StackNavigationProp } from "@react-navigation/stack";
import { createSelector } from "@reduxjs/toolkit";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { useSelector } from "react-redux";
import * as R from "remeda";
import Header from "../../../../components/Header/Header.component";
import WarningBox from "../../../../components/WarningBox/WarningBox.component";
import { colours } from "../../../../root.theme";
import { selectAllEnhancedOffers } from "../../../../selectors/selectAllEnhancedOffers.selector";
import { YourStuffStackParameterList } from "../../../../shared.types";
import OfferList from "../../../OfferList/OfferList.scene";

const selector = createSelector([selectAllEnhancedOffers], (enhancedOffers) => {
  return R.pipe(
    enhancedOffers,
    // TODO Figure out how to group duplicated offers here
    R.filter(
      (enhancedOffer) =>
        enhancedOffer.offer.mine && enhancedOffer.offer.proximity === 0
    ),
    R.sortBy((enhancedOffer) => enhancedOffer.offer.updatedAt),
    R.reverse()
  );
});

const YourStuffList = ({
  navigation,
}: {
  navigation: StackNavigationProp<YourStuffStackParameterList, "YourStuffList">;
}) => {
  const enhancedOffers = useSelector(selector);

  return (
    <View style={styles.container}>
      <Header title="Your stuff" />
      <View style={styles.contentContainer}>
        <WarningBox />
        <Button
          icon={{ name: "add", color: colours.black }}
          type="outline"
          containerStyle={styles.addButtonContainer}
          title="Add something to share"
          onPress={() => {
            navigation.navigate("OfferForm");
          }}
        />
        <View style={styles.FlatListWrapper}>
          <OfferList enhancedOffers={enhancedOffers} />
        </View>
      </View>
    </View>
  );
};

export default YourStuffList;

const styles = StyleSheet.create({
  addButtonContainer: {
    marginTop: -24,
    marginBottom: 40,
  },
  container: {
    display: "flex",
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    display: "flex",
    flex: 1,
  },
  FlatListWrapper: {
    flexGrow: 1,
  },
});
