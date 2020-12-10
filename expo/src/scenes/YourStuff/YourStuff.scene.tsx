import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header.component";
import { selectAllMyOffers } from "../../services/library/library.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import { DrawerParamList, OfferInRedux } from "../../shared.types";

const log = rootLogger.extend("YourStuff");

const YourStuff = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<DrawerParamList, "YourStuff">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const offers = useSelector(selectAllMyOffers);

  const renderItem = useCallback(({ item: offer }: { item: OfferInRedux }) => {
    return (
      <Card>
        <Card.Title>{offer.title}</Card.Title>
        <Card.Divider />
        <Text>{offer.bodyMarkdown}</Text>
      </Card>
    );
  }, []);

  return (
    <View>
      <Header title="Your Stuff" />
      <View>
        <FlatList data={offers} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default YourStuff;

const styles = StyleSheet.create({
  navButtonWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  navButton: {
    flex: 1,
    paddingHorizontal: 6,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    marginVertical: 3,
    width: "60%",
  },
});
