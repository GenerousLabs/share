import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { montserratBold } from "../../../../root.theme";
import { createNewOfferSagaAction } from "../../../../services/library/sagas/createNewOffer.saga";
import { selectMyLibraryRepo } from "../../../../services/repo/repo.state";
import { EnhancedOfferWithAlternates } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";
import { getOfferSharingText } from "../../../../utils/offer.utils";

const OfferSingle = ({
  enhancedOffer,
}: {
  enhancedOffer: EnhancedOfferWithAlternates;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const libraryRepo = useSelector(selectMyLibraryRepo);

  const { offer, alternates } = enhancedOffer;
  const { title, bodyMarkdown, tags } = offer;

  const isMine = offer.mine && offer.proximity === 0;
  const myImportedCopy = alternates?.find(
    ({ offer }) => offer.mine && offer.proximity > 0
  );
  const hasBeenImported = typeof myImportedCopy !== "undefined";

  const canBeImported = !isMine && offer.proximity + 1 < offer.shareToProximity;

  return (
    <View>
      <Text style={styles.sharedBy}>{getOfferSharingText(enhancedOffer)}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.bodyMarkdown}>{bodyMarkdown}</Text>
      {tags.length > 0 ? (
        <Text style={styles.tags}>#{tags.join(" #")}</Text>
      ) : null}
      {canBeImported && !hasBeenImported ? (
        <Button
          title="Import into Your Stuff"
          onPress={() => {
            Alert.alert(
              "Import this offer?",
              "Do you want to import this offer and add it to your own collection to share with your community?",
              [
                { text: "No" },
                {
                  text: "Yes",
                  onPress: async () => {
                    try {
                      await dispatch(
                        createNewOfferSagaAction({
                          repoId: libraryRepo.id,
                          importOfferId: offer.id,
                        })
                      );
                    } catch (error) {
                      Alert.alert(
                        "Error",
                        `There was an error.\n\n${error.message}`
                      );
                    }
                  },
                },
              ]
            );
          }}
        />
      ) : null}
      {hasBeenImported ? <Text>You have already imported this. </Text> : null}
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
