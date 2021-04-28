import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { montserratBold } from "../../../../root.theme";
import { createNewOfferSagaAction } from "../../../../services/library/sagas/createNewOffer.saga";
import { rootLogger } from "../../../../services/log/log.service";
import { selectMyLibraryRepo } from "../../../../services/repo/repo.state";
import { EnhancedOffer } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";
import { getOfferSharingText } from "../../../../utils/offer.utils";

const OfferSingle = ({ enhancedOffer }: { enhancedOffer: EnhancedOffer }) => {
  const dispatch: RootDispatch = useDispatch();
  const libraryRepo = useSelector(selectMyLibraryRepo);
  const sharingText = getOfferSharingText(enhancedOffer);

  const { offer } = enhancedOffer;

  const canBeImported =
    // TODO - The `proximity` value in redux should be correct
    offer.proximity + 1 < offer.shareToProximity && !offer.mine;
  rootLogger.debug("OfferSingle #KsMXt9", offer);

  return (
    <View>
      <Text style={styles.sharedBy}>{sharingText}</Text>
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.bodyMarkdown}>{offer.bodyMarkdown}</Text>
      {offer.tags.length > 0 ? (
        <Text style={styles.tags}>#{offer.tags.join(" #")}</Text>
      ) : null}
      {canBeImported ? (
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
