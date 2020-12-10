import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { createSelector } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { Share, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import invariant from "tiny-invariant";
import Header from "../../../../components/Header/Header.component";
import { createReadAuthTokenForRepoSagaAction } from "../../../../services/commands/commands.saga";
import {
  ConnectionCodeType,
  createConnectionCode,
} from "../../../../services/connection/connection.service";
import {
  selectAllRepoShares,
  selectConnectionById,
} from "../../../../services/connection/connection.state";
import { createRemoteUrlForSharedRepo } from "../../../../services/remote/remote.service";
import { selectLibraryRepo } from "../../../../services/repo/repo.state";
import { ConnectionsStackParameterList } from "../../../../shared.types";
import { RootDispatch, RootState } from "../../../../store";
import { getKeysIfEncryptedRepo } from "../../../../utils/key.utils";
import Confirm from "../Confirm/Confirm.scene";

const makeSelector = (connectionId: string) =>
  createSelector(
    selectAllRepoShares,
    (state: RootState) => selectConnectionById(state, connectionId),
    // We select the library as a single selector to ensure that there's no race
    // conditions, either the whole package is avialable, or not.
    selectLibraryRepo,
    (allShares, connection, library) => {
      const repoShare = allShares.find(
        (s) => s.connectionId === connection?.id
      );
      return {
        connection,
        repoShare,
        library,
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
  const { connection, repoShare, library } = useSelector(selector);

  const getOrCreateToken = useMemo(
    () => async () => {
      if (typeof repoShare !== "undefined") {
        return repoShare.token;
      }

      const { token } = await dispatch(
        createReadAuthTokenForRepoSagaAction({ repoId: library.id })
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

  const confirmed = typeof connection.theirRepoId === "string";

  if (!confirmed) {
    return <Confirm connectionId={connectionId} goBack={navigation.goBack} />;
  }

  return (
    <View>
      <Header title={connection.name} goBack={navigation.goBack} />
      <ScrollView>
        <Text>Coming in a second or six</Text>
        <Button
          title="Share your stuff code"
          onPress={async () => {
            const token = await getOrCreateToken();
            const { url } = await createRemoteUrlForSharedRepo({
              repo: library,
              token,
            });
            const myRemoteUrl = `encrypted::${url}`;
            const myKeysBase64 = await getKeysIfEncryptedRepo({
              repo: library,
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
      </ScrollView>
    </View>
  );
};

export default ConnectionsSingle;
