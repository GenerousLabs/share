import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { getLogs } from "../../../../services/log/log.service";

const Log = ({ closeOverlay }: { closeOverlay: () => void }) => {
  const [logs, setLogs] = useState("");

  const loadLogs = useCallback(async () => {
    const logsFromDisk = await getLogs();
    setLogs(logsFromDisk);
    // Alert.alert("Logs", logsFromDisk);
  }, [setLogs]);

  return (
    <View style={styles.container}>
      <Text h1>Log</Text>
      <View style={styles.buttonsContainer}>
        <Button
          containerStyle={styles.buttonContainer}
          title="Load logs"
          onPress={loadLogs}
        />
        <Button
          containerStyle={styles.buttonContainer}
          title="Close logs"
          onPress={closeOverlay}
        />
      </View>
      {/* {logs !== "" ? <Input multiline numberOfLines={30} value={logs} /> : null} */}
      <View style={styles.logs}>
        {logs !== "" ? (
          <ScrollView>
            <Text>{logs}</Text>
          </ScrollView>
        ) : null}
      </View>
    </View>
  );
};

export default Log;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  logs: {
    flex: 1,
  },
});
