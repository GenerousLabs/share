import { Picker } from "@react-native-community/picker";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { createNewOfferAction } from "../../../../services/library/library.state";
import { selectAllRepos } from "../../../../services/repo/repo.state";
import { OfferInRedux } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";

type Inputs = {
  repoId: string;
  title: string;
  bodyMarkdown: string;
};

const OfferForm = () => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors, reset } = useForm<Inputs>();
  const repos = useSelector(selectAllRepos);

  // TODO Provide a meaningful way to choose a repo here
  const onSubmit = (data: Inputs) => {
    debugger;
    const offer: Omit<OfferInRedux, "id"> = {
      uuid: uuid(),
      mine: true,
      proximity: 0,
      shareToProximity: 1,
      ...data,
    };
    dispatch(createNewOfferAction({ offer }));
  };

  if (repos.length === 0) {
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
            {repos.map((repo) => (
              <Picker.Item
                key={repo.repoId}
                label={repo.title}
                value={repo.repoId}
              />
            ))}
          </Picker>
        )}
        name="repoId"
        rules={{ required: true }}
        defaultValue={repos[0].repoId}
      />
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
});
