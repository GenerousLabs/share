import React, { useMemo, useState } from "react";
import { Alert, Share, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { makeSelectConnectionAndRepoById } from "../../../../services/connection/connection.state";
import { getShareInviteMessage } from "../../../../services/messages/messages.service";
import { sharedStyles } from "../../../../shared.styles";
import { log as parentLogger } from "../../Connections.log";

const log = parentLogger.extend("Confirm");

const Confirm = ({
  connectionId,
  goBack,
}: {
  connectionId: string;
  goBack: () => void;
}) => {
  const selector = useMemo(
    () => makeSelectConnectionAndRepoById(connectionId),
    [connectionId]
  );
  const { connection, repo } = useSelector(selector);
  const [isWorking, setIsworking] = useState(false);

  if (typeof connection === "undefined" || typeof repo === "undefined") {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header title="Waiting for a reply" goBack={goBack} />
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text>
            Waiting for{" "}
            <Text style={{ fontWeight: "bold" }}>{connection?.name}</Text> to
            reply.
          </Text>

          <Text>Your invitation code was:</Text>
          <Input value={connection?.postofficeCode} />

          <Button
            title="Share the invite code again"
            loading={isWorking}
            onPress={async () => {
              setIsworking(true);

              const code = connection.postofficeCode;
              if (typeof code === "undefined") {
                return Alert.alert(
                  "Error #hXKmIk",
                  "There was an unexpected error."
                );
              }

              const message = getShareInviteMessage({ code });
              const result = await Share.share({ message: message });
              if (result.action === Share.dismissedAction) {
                log.debug("Sharing cancelled #g4hRzl");
              }
              setIsworking(false);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  ...sharedStyles,
});
