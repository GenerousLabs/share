import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../Navigation/Navigation.scene";
import { selectMyLibraries } from "../../services/library/library.selectors";
import { RootDispatch } from "../../store";
import LibraryForm from "./scenes/LibraryForm/LibraryForm.scene";

const Libraries = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
}) => {
  const libraries = useSelector(selectMyLibraries);
  const dispatch: RootDispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <Text style={styles.title}>Libraries</Text>
      </View>
      <View>
        <Button
          title="Go Home"
          color="red"
          onPress={() => {
            navigation.navigate("Home");
          }}
        />
      </View>
      <View>
        {libraries.length > 0 ? (
          <FlatList
            data={libraries}
            renderItem={(item) => (
              <View>
                <Text>{item.item.title}</Text>
                <Text>{item.item.bodyMarkdown}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <Text>Add some libraries to see them here</Text>
        )}
      </View>
      <LibraryForm />
    </SafeAreaView>
  );
};

export default Libraries;

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
  },
  navButtonWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  navButton: {
    flex: 1,
    paddingHorizontal: 6,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
    marginLeft: "10%",
    backgroundColor: "blue",
  },
});
