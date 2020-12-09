import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { Header, Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOffers } from "../../services/library/library.state";
import { RootStackParamList } from "../../shared.types";
import { RootDispatch, RootState } from "../../store";
import OfferForm from "./scenes/OfferForm/OfferForm.scene";

const Offers = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootStackParamList, "Offers">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const offers = useSelector((state: RootState) => selectAllOffers(state));

  return (
    <View>
      <Header
        leftComponent={{
          icon: "menu",
          color: "#fff",
          onPress: () => navigation.openDrawer(),
        }}
        centerComponent={{ text: "Browser", color: "#fff" }}
        rightComponent={{ icon: "home", color: "#fff" }}
      />
      <View>
        <Text h1>Welcome to Offers</Text>
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
    </View>
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
