import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { createNewOfferSagaAction } from "../../../../services/library/library.saga";
import { selectMyLibraryRepo } from "../../../../services/library/library.selectors";
import { YourStuffStackParameterList } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";
import { generateUuid } from "../../../../utils/id.utils";

type Inputs = {
  // repoId: string;
  title: string;
  bodyMarkdown: string;
};

const OfferForm = ({
  navigation,
}: {
  navigation: StackNavigationProp<YourStuffStackParameterList, "OfferList">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors, reset, formState } = useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const libraries = useSelector(selectMyLibraries);
  const library = useSelector(selectMyLibraryRepo);

  // TODO Provide a meaningful way to choose a repo here
  const onSubmit = useCallback(
    async (data: Inputs) => {
      setIsSubmitting(true);
      const uuid = generateUuid();
      await dispatch(
        createNewOfferSagaAction({
          repoId: library.id,
          // repoId: data.repoId,
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
      Alert.alert("Saved", "Your offer has been saved.");
      reset();
      setIsSubmitting(false);
    },
    [setIsSubmitting]
  );

  return (
    <View>
      <Header title="Add an offer" goBack={navigation.goBack} />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
          {/* <Text>Repo:</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Picker
                selectedValue={value}
                style={styles.input}
                onValueChange={(value) => onChange(value)}
              >
                {libraries.map((repo) => (
                  <Picker.Item
                    key={repo.id}
                    label={repo.title}
                    value={repo.id}
                  />
                ))}
              </Picker>
            )}
            name="repoId"
            rules={{ required: true }}
            defaultValue={libraries[0].id}
          /> */}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                label="Offer title"
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
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                label="Enter a description"
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
          <Button
            title="Add offer to library"
            loading={formState.isSubmitting || isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OfferForm;

const styles = StyleSheet.create({
  ScrollViewInner: {
    paddingBottom: 200,
  },
});
