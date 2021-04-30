import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import Header from "../../../../components/Header/Header.component";
import { getLogs } from "../../../../services/log/log.service";

const Log = () => {
  const [logs, setLogs] = useState("");

  const loadLogs = useCallback(async () => {
    const logsFromDisk = await getLogs();
    setLogs(logsFromDisk);
    // Alert.alert("Logs", logsFromDisk);
  }, [setLogs]);

  return (
    <View style={styles.container}>
      <Header title="Logs" />
      <View style={styles.buttonsContainer}>
        <Button
          containerStyle={styles.buttonContainer}
          title="Load logs"
          onPress={loadLogs}
        />
      </View>
      {/* {logs !== "" ? <Input multiline numberOfLines={30} value={logs} /> : null} */}
      <View style={styles.logs}>
        {logs !== "" ? <Text>{logs}</Text> : null}
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
