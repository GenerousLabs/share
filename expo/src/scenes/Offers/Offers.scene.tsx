import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../../types";
import { MonoText } from "../../components/StyledText";

const Offers = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Offers">;
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        <MonoText>Welcome to Offers</MonoText>
      </View>
      <View>
        <Button
          title="View Home"
          onPress={() => {
            navigation.navigate("Home");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Offers;
