import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { colours, montserratBold } from "../../../../root.theme";
import { isImportedOffer } from "../../../../services/library/library.utils";
import { archiveOfferSagaAction } from "../../../../services/library/sagas/archiveOffer.saga";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const { offer, alternates } = enhancedOffer;
  const { title, bodyMarkdown, tags } = offer;

  const isMine = offer.mine && offer.proximity === 0;
  const myImportedCopy = alternates?.find(({ offer }) =>
    isImportedOffer(offer)
  );
  const hasBeenImported = typeof myImportedCopy !== "undefined";

  const canBeImported = !isMine && offer.proximity + 1 < offer.shareToProximity;

  const isArchived = typeof offer.archivedAt === "number";

  const wrappingStyle = isArchived ? { opacity: 0.2 } : undefined;

  const archiveButton = useCallback(() => {
    if (!isMine || isArchived) {
      return null;
    }

    if (isSubmitting)
      return (
        <ActivityIndicator
          animating={true}
          size="small"
          color={colours.grey5}
          style={[styles.actionIcon, { width: 26, height: 26 }]}
        />
      );

    return (
      <MaterialIcons
        name="delete-outline"
        color={colours.black}
        size={26}
        style={styles.actionIcon}
        onPress={() => {
          Alert.alert(
            "Archive this item?",
            "Do you want to archive this item? There is no undo.",
            [
              { text: "No" },
              {
                text: "Yes",
                onPress: async () => {
                  try {
                    setIsSubmitting(true);
                    await dispatch(archiveOfferSagaAction({ id: offer.id }));
                  } catch (error) {
                    setIsSubmitting(false);
                    Alert.alert(
                      "Error #xL8JbK",
                      `There was an error.\n\n${error.message}`
                    );
                  }
                },
              },
            ]
          );
        }}
      />
    );
  }, [isMine, isArchived, isSubmitting, offer]);

  const importButton = useCallback(() => {
    if (!canBeImported) {
      return null;
    }

    if (hasBeenImported) {
      return (
        <MaterialIcons
          name="cloud-done"
          color={colours.grey5}
          size={26}
          style={styles.actionIcon}
        />
      );
    }

    if (isImporting) {
      return (
        <ActivityIndicator
          animating={true}
          size="small"
          color={colours.grey5}
          style={[styles.actionIcon, { width: 26, height: 26 }]}
        />
      );
    }

    return (
      <MaterialIcons
        name="cloud-download"
        color={colours.black}
        size={26}
        style={styles.actionIcon}
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
                    setIsImporting(true);
                    await dispatch(
                      createNewOfferSagaAction({
                        repoId: libraryRepo.id,
                        importOfferId: offer.id,
                      })
                    );
                  } catch (error) {
                    setIsImporting(false);
                    Alert.alert(
                      "Error #ywMkO7",
                      `There was an error.\n\n${error.message}`
                    );
                  }
                },
              },
            ]
          );
        }}
      />
    );
  }, [
    canBeImported,
    hasBeenImported,
    isImporting,
    setIsImporting,
    libraryRepo,
    offer,
  ]);

  return (
    <View style={wrappingStyle}>
      <Text style={styles.sharedBy}>{getOfferSharingText(enhancedOffer)}</Text>
      <View>
        <Text style={styles.title}>{title}</Text>
        {archiveButton()}
        {importButton()}
      </View>
      <Text style={styles.bodyMarkdown}>{bodyMarkdown}</Text>
      {tags.length > 0 ? (
        <Text style={styles.tags}>#{tags.join(" #")}</Text>
      ) : null}
    </View>
  );
};

export default OfferSingle;

const styles = StyleSheet.create({
  actionIcon: {
    position: "absolute",
    right: 0,
  },
  title: {
    fontFamily: montserratBold,
    fontSize: 20,
    lineHeight: 24,
    marginRight: 26 + 4,
    flexGrow: 1,
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
