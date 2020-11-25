import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../../types";
import { MonoText } from "../../components/StyledText";

const Home = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <MonoText>Welcome to Home</MonoText>
      </View>
      <View>
        <Button
          title="View offers"
          onPress={() => {
            navigation.navigate("Offers");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
