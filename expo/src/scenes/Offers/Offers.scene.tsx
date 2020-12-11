import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header.component";
import { selectAllOffers } from "../../services/library/library.state";
import { RootDrawerParamList } from "../../shared.types";
import { RootDispatch, RootState } from "../../store";
import OfferForm from "./scenes/OfferForm/OfferForm.scene";

const Offers = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Offers">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const offers = useSelector((state: RootState) => selectAllOffers(state));

  return (
    <View>
      <Header />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
          <View>
            <Text h1>Welcome to Offers</Text>
          </View>
          <OfferForm />
        </View>
      </ScrollView>
    </View>
  );
};

export default Offers;

const styles = StyleSheet.create({
  ScrollViewInner: {
    paddingBottom: 200,
  },
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
