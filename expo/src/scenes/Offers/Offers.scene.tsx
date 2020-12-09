import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { MonoText } from "../../components/StyledText";
import { selectAllOffers } from "../../services/library/library.state";
import { RootStackParamList } from "../../shared.types";
import { RootDispatch, RootState } from "../../store";
import OfferForm from "./scenes/OfferForm/OfferForm.scene";

const Offers = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Offers">;
}) => {
  const dispatch: RootDispatch = useDispatch();
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
      <OfferForm />
      <FlatList
        data={offers}
        renderItem={(item) => (
          <View>
            <Text>{item.item.title}</Text>
            <Text>{item.item.bodyMarkdown}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default Offers;

const styles = StyleSheet.create({
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
    marginLeft: "10%",
    backgroundColor: "blue",
  },
  input: {
    borderColor: "black",
    borderWidth: 2,
    padding: 4,
    margin: 10,
  },
  inputMultiline: {
    borderColor: "black",
    borderWidth: 2,
    padding: 4,
    margin: 10,
  },
});
