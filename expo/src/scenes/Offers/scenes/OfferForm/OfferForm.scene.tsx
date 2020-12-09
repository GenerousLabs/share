import { Picker } from "@react-native-community/picker";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, View } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { createReadAuthTokenForRepoSagaAction } from "../../../../services/commands/commands.saga";
import { createNewOfferSagaAction } from "../../../../services/library/library.saga";
import { selectMyLibraries } from "../../../../services/library/library.selectors";
import { RootDispatch } from "../../../../store";
import { generateUuid } from "../../../../utils/id.utils";

type Inputs = {
  repoId: string;
  title: string;
  bodyMarkdown: string;
};

const OfferForm = () => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors, reset } = useForm<Inputs>();
  const libraries = useSelector(selectMyLibraries);

  // TODO Provide a meaningful way to choose a repo here
  const onSubmit = (data: Inputs) => {
    const uuid = generateUuid();
    dispatch(
      createNewOfferSagaAction({
        repoId: data.repoId,
        offer: {
          uuid,
          proximity: 0,
          shareToProximity: 1,
          tags: [],
          bodyMarkdown: data.bodyMarkdown,
          title: data.title,
        },
      })
    );
  };

  if (libraries.length === 0) {
    return (
      <View>
        <Text>Create a repo first to be able to create offers.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Repo:</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <Picker
            selectedValue={value}
            style={styles.input}
            onValueChange={(value) => onChange(value)}
          >
            {libraries.map((repo) => (
              <Picker.Item key={repo.id} label={repo.title} value={repo.id} />
            ))}
          </Picker>
        )}
        name="repoId"
        rules={{ required: true }}
        defaultValue={libraries[0].id}
      />
      <Text>Offer title:</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <Input
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
          <Input
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
      <View style={styles.authButtonWrapper}>
        <Button
          color="darkred"
          title="Create a new auth token for this repo"
          onPress={() => {
            dispatch(
              createReadAuthTokenForRepoSagaAction({
                repoId: libraries[0].id,
              })
            );
          }}
        />
      </View>
    </View>
  );
};

export default OfferForm;

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
  authButtonWrapper: {
    marginTop: 40,
  },
});
