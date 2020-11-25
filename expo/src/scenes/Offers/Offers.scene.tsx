import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootStackParamList } from "../../../types";
import { MonoText } from "../../components/StyledText";
import { selectAllOffers } from "../../services/library/library.state";
import { RootState } from "../../store";

const Offers = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Offers">;
}) => {
  const offers = useSelector((state: RootState) => selectAllOffers(state));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <MonoText>Welcome to Offers</MonoText>
      </View>
      <View>
        <Button
          title="View Home"
          onPress={() => {
            navigation.navigate("Home");
          }}
        />
      </View>
      <View>
        {offers.map((offer) => (
          <View key={offer.id}>
            <Text>{offer.title}</Text>
            <Text>{offer.bodyMarkdown}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Offers;
