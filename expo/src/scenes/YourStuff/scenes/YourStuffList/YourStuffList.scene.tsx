import React, { useMemo } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { reverse, sortBy } from "remeda";
import Header from "../../../../components/Header/Header.component";
import WIPMessage from "../../../../components/WIPMessage/WIPMessage.component";
import { selectAllMyOffers } from "../../../../services/library/library.state";
import OfferList from "../../../OfferList/OfferList.scene";

const YourStuffList = () => {
  const offers = useSelector(selectAllMyOffers);
  const sortedOffers = useMemo(
    () => reverse(sortBy(offers, (offer) => offer.updatedAt)),
    [offers]
  );

  return (
    <View>
      <Header title="Your stuff" />
      <WIPMessage />
      <OfferList offers={sortedOffers} />
    </View>
  );
};

export default YourStuffList;
