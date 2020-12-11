import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header.component";
import { createInviteSagaAction } from "../../services/connection/connection.saga";
import { createNewOfferSagaAction } from "../../services/library/library.saga";
import { getLogs, rootLogger } from "../../services/log/log.service";
import {
  DANGEROUS_setupResetSagaAction,
  setupSagaAction,
} from "../../services/setup/setup.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { RootDrawerParamList } from "../../shared.types";
import { RootDispatch } from "../../store";

const log = rootLogger.extend("Home");

const Home = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Home">;
}) => {
  const dispatch: RootDispatch = useDispatch();

  return (
    <View>
      <Header />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="NordVPN"
            onPress={async () => {
              dispatch(
                setupSagaAction({
                  config: {
                    remote: {
                      protocol: "http",
                      host: "192.168.178.59:8000",
                      token: "abc123",
                      username: "x4",
                    },
                  },
                })
              );
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Log error"
            buttonStyle={{ backgroundColor: "darkred" }}
            onPress={() => {
              log.error("An error #SENEUH", new Error("Awry #PYShEI"));
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Create new asset"
            onPress={() => {
              dispatch(
                createNewOfferSagaAction({
                  offer: {
                    bodyMarkdown: "A new offer",
                    proximity: 0,
                    shareToProximity: 1,
                    title: "An offer",
                    uuid: "uuid-example",
                    tags: [],
                  },
                  repoId: "re2",
                })
              );
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Create new invite"
            onPress={async () => {
              const invite = await dispatch(
                createInviteSagaAction({
                  name: "Alice",
                  notes: "Inviting Alice",
                })
              );
              Alert.alert("Invite created", JSON.stringify(invite), [
                { text: "Stop here" },
              ]);
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Export repos as zip"
            buttonStyle={{ backgroundColor: "#116530" }}
            onPress={async () => {
              await createAndShareZipFile({ path: "/repos" });
              Alert.alert("Zip export finished #znvf34");
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            buttonStyle={{ backgroundColor: "lightblue" }}
            title="Show logs"
            onPress={async () => {
              try {
                const logs = await getLogs();
                // NOTE: We don't use `log.()` here because we don't want to log
                // the logs again
                console.log("log #kP1xw6", logs);
                Alert.alert(`Log file`, logs);
              } catch (error) {
                log.error(error);
              }
            }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            buttonStyle={{ backgroundColor: "grey" }}
            title="DANGEROUS reset the whole application"
            onPress={() => {
              Alert.alert(
                "DANGEROUS",
                "Are you sure you want to DELETE EVERYTHING FOREVER? There is absolutely NO UNDO.",
                [
                  {
                    text: "Yes",
                    onPress: () => dispatch(DANGEROUS_setupResetSagaAction()),
                  },
                  { text: "No" },
                ]
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  navButtonWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  navButton: {
    flex: 1,
    paddingHorizontal: 6,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    marginVertical: 3,
    width: "60%",
  },
});
