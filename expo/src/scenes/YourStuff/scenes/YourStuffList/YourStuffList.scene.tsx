import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { useSelector } from "react-redux";
import { reverse, sortBy } from "remeda";
import Header from "../../../../components/Header/Header.component";
import WarningBox from "../../../../components/WarningBox/WarningBox.component";
import { colours } from "../../../../root.theme";
import { selectAllMyOffers } from "../../../../services/library/library.state";
import { YourStuffStackParameterList } from "../../../../shared.types";
import OfferList from "../../../OfferList/OfferList.scene";

const YourStuffList = ({
  navigation,
}: {
  navigation: StackNavigationProp<YourStuffStackParameterList, "YourStuffList">;
}) => {
  const offers = useSelector(selectAllMyOffers);
  const sortedOffers = useMemo(
    () => reverse(sortBy(offers, (offer) => offer.updatedAt)),
    [offers]
  );

  return (
    <View style={styles.container}>
      <Header title="Your stuff" />
      <View style={styles.contentContainer}>
        <WarningBox />
        <Button
          icon={{ name: "add", color: colours.black }}
          type="outline"
          containerStyle={styles.addButtonContainer}
          title="Add an offer"
          onPress={() => {
            navigation.navigate("OfferForm");
          }}
        />
        <View style={styles.FlatListWrapper}>
          <OfferList offers={sortedOffers} />
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
