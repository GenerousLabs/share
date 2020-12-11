import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header.component";
import { selectMyLibraryRepos } from "../../services/library/library.selectors";
import { RootDrawerParamList } from "../../shared.types";
import { RootDispatch } from "../../store";
import LibraryForm from "./scenes/LibraryForm/LibraryForm.scene";

const Libraries = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Home">;
}) => {
  const libraries = useSelector(selectMyLibraryRepos);
  const dispatch: RootDispatch = useDispatch();

  return (
    <View>
      <Header />
      <View>
        <Text h1>Libraries</Text>
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
    </View>
  );
};

export default Libraries;

const styles = StyleSheet.create({
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
