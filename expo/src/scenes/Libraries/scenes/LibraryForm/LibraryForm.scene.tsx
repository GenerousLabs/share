import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, View } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch } from "react-redux";
import { createNewLibrarySagaAction } from "../../../../services/library/library.state";
import { RootDispatch } from "../../../../store";

type Inputs = {
  title: string;
  bodyMarkdown: string;
};

const LibraryForm = () => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors, reset } = useForm<Inputs>();

  // TODO Provide a meaningful way to choose a repo here
  const onSubmit = (data: Inputs) => {
    dispatch(createNewLibrarySagaAction(data));
  };

  return (
    <View>
      <Text>Library title:</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            autoCapitalize="words"
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
      <Button title="Create a new library" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default LibraryForm;

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
