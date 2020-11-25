import { StackNavigationProp } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system";
import React from "react";
import { Alert, Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { RootStackParamList } from "../../../types";
import { MonoText } from "../../components/StyledText";
import { createNewOffer } from "../../services/library/library.state";
import { createRepo } from "../../services/repo/repo.state";
import { createAndShareZipFile } from "../../services/zip/zip.service";
import { RootDispatch } from "../../store";

const Home = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
}) => {
  const dispatch: RootDispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <MonoText>Welcome to Home</MonoText>
      </View>
      <View>
        <Button
          title="View offers"
          color="red"
          onPress={() => {
            navigation.navigate("Offers");
          }}
        />
      </View>
      <View>
        <Button
          title="Create new repo"
          onPress={() => {
            dispatch(
              createRepo({
                repoId: "re2",
                title: "Testing repos",
                descriptionMarkdown:
                  "This is a test repo.\n\n- A list\n- With two items\n\nAnd more text",
                path: "/re2/",
                uuid: "re2-uuid-example",
              })
            );
          }}
        />
        <Button
          title="Create new asset"
          onPress={() => {
            dispatch(
              createNewOffer({
                offer: {
                  bodyMarkdown: "A new offer",
                  id: "offer1",
                  mine: true,
                  proximity: 0,
                  repoId: "re2",
                  shareToProximity: 1,
                  title: "An offer",
                  uuid: "uuid-example",
                },
              })
            );
          }}
        />
        <Button
          title="Delete re2"
          onPress={async () => {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "re2/");
            Alert.alert("Done");
          }}
        />
        <Button
          title="Export re2 as zip"
          onPress={async () => {
            await createAndShareZipFile({ path: "/re2" });
            Alert.alert("Zip export finished #uuOdQ4");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
