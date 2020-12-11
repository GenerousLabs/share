import { DrawerNavigationProp } from "@react-navigation/drawer";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { reverse, sortBy } from "remeda";
import Header from "../../../../components/Header/Header.component";
import { selectAllMyOffers } from "../../../../services/library/library.state";
import { rootLogger } from "../../../../services/log/log.service";
import { RootDispatch } from "../../../../services/store/store.service";
import {
  RootDrawerParamList,
  OfferInRedux,
  YourStuffStackParameterList,
} from "../../../../shared.types";

const log = rootLogger.extend("OfferList");

const OfferList = ({
  navigation,
}: {
  navigation: StackNavigationProp<YourStuffStackParameterList, "OfferList">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const offers = useSelector(selectAllMyOffers);
  const sortedOffers = useMemo(
    () => reverse(sortBy(offers, (offer) => offer.updatedAt)),
    [offers]
  );

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
    <View style={styles.container}>
      <Header title="Your Stuff" />
      <Button
        title="Add an offer"
        onPress={() => navigation.navigate("OfferForm")}
      />
      <FlatList
        data={sortedOffers}
        renderItem={renderItem}
        ListFooterComponent={View}
        ListFooterComponentStyle={styles.ScollViewInner}
      />
    </View>
  );
};

export default OfferList;

const styles = StyleSheet.create({
  // TODO Remove this after fixing ScrollViewHeight issue
  ScollViewInner: {
    paddingBottom: 200,
  },
  container: {
    display: "flex",
  },
});
