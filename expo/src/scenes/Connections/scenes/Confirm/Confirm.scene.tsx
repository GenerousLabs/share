import React, { useMemo, useState } from "react";
import { Share, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import {
  ConnectionCodeType,
  getConnectionCode,
} from "../../../../services/connection/connection.service";
import { makeSelectConnectionAndRepoById } from "../../../../services/connection/connection.state";
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

  return (
    <View>
      <Header title="Waiting" goBack={goBack} />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
          <Text>Coming soon...</Text>
          {typeof connection === "undefined" ||
          typeof repo === "undefined" ? null : (
            <Button
              title="Send the invite code again"
              loading={isWorking}
              onPress={async () => {
                setIsworking(true);
                const code = await getConnectionCode({
                  connection,
                  repo,
                  type: ConnectionCodeType.CONFIRM,
                });
                const result = await Share.share({ message: code });
                if (result.action === Share.dismissedAction) {
                  log.debug("Sharing cancelled #g4hRzl");
                }
                setIsworking(false);
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  ScrollViewInner: {
    paddingBottom: 200,
  },
});
