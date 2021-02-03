import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { montserratBold } from "../../../../root.theme";
import { OfferPlusRepoAndConnection } from "../../../../selectors/selectAllOffersPlusRepoAndConnection.selector";
import { isOfferMine } from "../../../../services/library/library.service";
import { OfferMine } from "../../../../shared.types";

const OfferSingle = ({
  offer,
}: {
  offer: OfferPlusRepoAndConnection | OfferMine;
}) => {
  const name = isOfferMine(offer) ? "me" : offer.connection.name;

  return (
    <View>
      <Text style={styles.sharedBy}>This is shared by {name}</Text>
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.bodyMarkdown}>{offer.bodyMarkdown}</Text>
      {offer.tags.length > 0 ? (
        <Text style={styles.tags}>#{offer.tags.join(" #")}</Text>
      ) : null}
    </View>
  );
};

export default OfferSingle;

const styles = StyleSheet.create({
  title: {
    fontFamily: montserratBold,
    fontSize: 20,
    lineHeight: 24,
  },
  sharedBy: {
    fontSize: 10,
    marginVertical: 8,
  },
  bodyMarkdown: {
    padding: 0,
    margin: 0,
    marginBottom: -20,
  },
  tags: {
    // There is additional unexplained space above the tags which we can't hide,
    // unclear what to do about it. :-(
    marginTop: 24,
    fontSize: 12,
    fontFamily: montserratBold,
  },
});
