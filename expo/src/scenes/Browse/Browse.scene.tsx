import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";
import { Header } from "react-native-elements";
import React, { useCallback } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { selectAllImportedOffers } from "../../services/library/library.state";
import { rootLogger } from "../../services/log/log.service";
import { RootDispatch } from "../../services/store/store.service";
import { OfferInRedux, RootStackParamList } from "../../shared.types";

const log = rootLogger.extend("Connection");

const Browse = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootStackParamList, "Browse">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const offers = useSelector(selectAllImportedOffers);

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
        <Text style={styles.title}>Browse</Text>
      </View>
      <View>
        <FlatList data={offers} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default Browse;

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
  },
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
