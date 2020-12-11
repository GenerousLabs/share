import React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { OfferInRedux } from "../../../../shared.types";

const OfferSingle = ({ offer }: { offer: OfferInRedux }) => {
  return (
    <View>
      <Text>Offer</Text>
    </View>
  );
};

export default OfferSingle;
