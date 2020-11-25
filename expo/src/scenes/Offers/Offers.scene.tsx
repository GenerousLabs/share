import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Text, View, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../../types";
import { MonoText } from "../../components/StyledText";
import {
  createNewOffer,
  selectAllOffers,
} from "../../services/library/library.state";
import { RootDispatch, RootState } from "../../store";
import { v4 as uuid } from "uuid";
import { Offer } from "../../services/library/library.service";
import { selectAllRepos } from "../../services/repo/repo.state";

type Inputs = {
  title: string;
  bodyMarkdown: string;
};

const Offers = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, "Offers">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors, reset } = useForm<Inputs>();
  const offers = useSelector((state: RootState) => selectAllOffers(state));
  const [repo] = useSelector(selectAllRepos);

  const onSubmit = (data: Inputs) => {
    const offer: Omit<Offer, "id"> = {
      uuid: uuid(),
      mine: true,
      proximity: 0,
      shareToProximity: 1,
      repoId: repo.repoId,
      ...data,
    };
    dispatch(createNewOffer({ offer }));
    console.log("Offers.scene onSubmit #ZaTu7o", data);
  };

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
      <View>
        <Text>Offer title:</Text>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="title"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors.title && <Text>Title is a required field</Text>}
        <Text>Enter a description</Text>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              style={styles.inputMultiline}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              multiline={true}
              numberOfLines={5}
            />
          )}
          name="bodyMarkdown"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors.bodyMarkdown && <Text>You need to enter some body text</Text>}
        <Button title="Add offer to library" onPress={handleSubmit(onSubmit)} />
      </View>
      <View>
        {offers.map((offer) => (
          <View key={offer.id}>
            <Text>{offer.title}</Text>
            <Text>{offer.bodyMarkdown}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Offers;

const styles = StyleSheet.create({
  input: {
    borderColor: "black",
    borderWidth: 2,
    padding: 4,
    margin: 10,
  },
  inputMultiline: {
    borderColor: "black",
    borderWidth: 2,
    padding: 4,
    margin: 10,
  },
});
