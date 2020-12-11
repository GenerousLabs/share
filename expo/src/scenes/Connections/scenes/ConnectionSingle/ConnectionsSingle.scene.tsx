import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { createSelector } from "@reduxjs/toolkit";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Share, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import invariant from "tiny-invariant";
import Header from "../../../../components/Header/Header.component";
import { createReadAuthTokenForRepoSagaAction } from "../../../../services/commands/commands.saga";
import {
  ConnectionCodeType,
  createConnectionCode,
  getConnectionCode,
  parseSharingCode,
} from "../../../../services/connection/connection.service";
import {
  selectAllRepoShares,
  selectConnectionById,
} from "../../../../services/connection/connection.state";
import { selectMyLibraryRepo } from "../../../../services/library/library.selectors";
import { subscribeToLibrarySagaAction } from "../../../../services/library/sagas/subscribeToLibrary.saga";
import { createRemoteUrlForSharedRepo } from "../../../../services/remote/remote.service";
import { selectAllRepos } from "../../../../services/repo/repo.state";
import { RepoType } from "../../../../shared.constants";
import { ConnectionsStackParameterList } from "../../../../shared.types";
import { RootDispatch, RootState } from "../../../../store";
import { getKeysIfEncryptedRepo } from "../../../../utils/key.utils";
import Confirm from "../Confirm/Confirm.scene";

const makeSelector = (connectionId: string) =>
  createSelector(
    selectAllRepoShares,
    selectAllRepos,
    (state: RootState) => selectConnectionById(state, connectionId),
    // We select my library as part of this to ensure that it's always available
    // when the connection loads. It's created during app setup, so if it
    // doesn't exist by now, something has gone very wrong.
    selectMyLibraryRepo,
    (allShares, repos, connection, myLibrary) => {
      const repoShare = allShares.find(
        (s) => s.connectionId === connection?.id
      );
      const myRepo = repos.find((r) => r.id === connection?.myRepoId);
      const theirLibrary = repos.find(
        (r) => r.type === RepoType.library && r.connectionId === connectionId
      );
      return {
        connection,
        repoShare,
        myRepo,
        theirLibrary,
        myLibrary,
      };
    }
  );

const ConnectionsSingle = ({
  route,
  navigation,
}: {
  route: RouteProp<ConnectionsStackParameterList, "ConnectionsSingle">;
  navigation: StackNavigationProp<
    ConnectionsStackParameterList,
    "ConnectionsHome"
  >;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { connectionId } = route.params;
  const selector = useMemo(() => makeSelector(connectionId), [connectionId]);
  const {
    connection,
    repoShare,
    myRepo,
    theirLibrary,
    myLibrary,
  } = useSelector(selector);

  const [libraryCode, setLibraryCode] = useState("");
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);

  const getOrCreateToken = useMemo(
    () => async () => {
      if (typeof repoShare !== "undefined") {
        return repoShare.token;
      }

      const { token } = await dispatch(
        createReadAuthTokenForRepoSagaAction({ repoId: myLibrary.id })
      );
      return token;
    },
    []
  );

  useEffect(() => {
    if (
      typeof connection === "undefined" ||
      typeof connection.theirRepoId === "undefined" ||
      typeof repoShare !== "undefined"
    ) {
      return;
    }
    // If the user doesn't have a repoShare matching this connection, make one now.
  }, [connectionId, connection]);

  if (typeof connection === "undefined") {
    return (
      <View>
        <Header title="Connection" goBack={navigation.goBack} />
        <Text>Loading</Text>
      </View>
    );
  }

  const isConfirmed = typeof connection.theirRepoId === "string";
  const hasImportedLibrary = typeof theirLibrary !== "undefined";

  if (!isConfirmed) {
    return <Confirm connectionId={connectionId} goBack={navigation.goBack} />;
  }

  return (
    <View>
      <Header title={connection.name} goBack={navigation.goBack} />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
          <Text>Messaging is coming soon...</Text>
          <Text>Coming in a second or six</Text>
          <Button
            title="Share your confirmation code"
            onPress={async () => {
              if (typeof myRepo === "undefined") {
                return Alert.alert(
                  "Error #1E9uID",
                  "There was an unexpected error."
                );
              }
              const code = await getConnectionCode({
                connection,
                repo: myRepo,
                type: ConnectionCodeType.CONFIRM,
              });
              Share.share({ message: code });
            }}
          />
          <Button
            title="Share your stuff code"
            onPress={async () => {
              const token = await getOrCreateToken();
              const { url } = await createRemoteUrlForSharedRepo({
                repo: myLibrary,
                token,
              });
              const myRemoteUrl = `encrypted::${url}`;
              const myKeysBase64 = await getKeysIfEncryptedRepo({
                repo: myLibrary,
              });
              invariant(myKeysBase64, "Failed to get keys for library #ycywPR");
              const code = await createConnectionCode({
                myKeysBase64,
                myRemoteUrl,
                type: ConnectionCodeType.SHARING,
              });
              Share.share({ message: code });
            }}
          />
          {hasImportedLibrary ? null : (
            <>
              <Text h2>Import a library</Text>
              <Text>
                This is a temporary feature. We'll remove this shortly once
                messages come online.
              </Text>
              <Input
                onChangeText={setLibraryCode}
                multiline
                numberOfLines={12}
              />
              <Button
                title="Import this library"
                loading={isCodeSubmitting}
                onPress={async () => {
                  if (libraryCode === "") {
                    Alert.alert(
                      "Error #noA3eQ",
                      `Please enter a code above. If this error repeats, let us know, we'll try to fix it.`
                    );
                  }
                  setIsCodeSubmitting(true);
                  const params = parseSharingCode({
                    code: libraryCode,
                    type: ConnectionCodeType.SHARING,
                  });
                  await dispatch(
                    subscribeToLibrarySagaAction({
                      name: connection.name,
                      connectionId,
                      remoteUrl: params.theirRemoteUrl,
                      keysBase64: params.theirKeysBase64,
                    })
                  );
                  Alert.alert(
                    "Library succesfully imported",
                    `Your friend's library was successfully imported. Checkout browse to see what they're sharing with you.`
                  );
                  setLibraryCode("");
                  setIsCodeSubmitting(false);
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ConnectionsSingle;

const styles = StyleSheet.create({
  ScrollViewInner: {
    paddingBottom: 200,
  },
});
