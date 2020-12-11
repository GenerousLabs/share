import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { useSelector } from "react-redux";
import { reverse, sortBy } from "remeda";
import Header from "../../../../components/Header/Header.component";
import WIPMessage from "../../../../components/WIPMessage/WIPMessage.component";
import { colours, montserratBold } from "../../../../root.theme";
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
    <View>
      <Header title="Your stuff" />
      <View style={styles.container}>
        <WIPMessage />
        <Button
          icon={{ name: "add", color: colours.black }}
          type="outline"
          containerStyle={styles.addButtonContainer}
          title="Add an offer"
          onPress={() => {
            navigation.navigate("OfferForm");
          }}
        />
        <View style={{ height: 200 }}>
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
    paddingHorizontal: 16,
    display: "flex",
  },
});
