import { zodResolver } from "@hookform/resolvers/zod";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import * as zod from "zod";
import Header from "../../../../components/Header/Header.component";
import RadioButtons from "../../../../components/RadioButtons/RadioButtons.component";
import { colours, montserrat } from "../../../../root.theme";
import { createNewOfferSagaAction } from "../../../../services/library/sagas/createNewOffer.saga";
import { selectMyLibraryRepo } from "../../../../services/repo/repo.state";
import { sharedStyles } from "../../../../shared.styles";
import { YourStuffStackParameterList } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";
import { generateUuid } from "../../../../utils/id.utils";
import { hashifyTags, parseTags } from "../../../../utils/tags.utils";

const InputSchema = zod.object({
  isOffer: zod.boolean(),
  title: zod.string().nonempty(),
  bodyMarkdown: zod.string().optional(),
  tags: zod.string().optional(),
  shareToProximity2: zod.boolean(),
});
type Inputs = zod.infer<typeof InputSchema>;

const OfferForm = ({
  navigation,
}: {
  navigation: StackNavigationProp<YourStuffStackParameterList, "YourStuffList">;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors, reset, formState } = useForm<Inputs>({
    resolver: zodResolver(InputSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const libraries = useSelector(selectMyLibraries);
  const library = useSelector(selectMyLibraryRepo);

  // TODO Provide a meaningful way to choose a repo here
  const onSubmit = useCallback(
    async (data: Inputs) => {
      setIsSubmitting(true);
      const uuid = generateUuid();
      const tags = parseTags(data.tags);
      try {
        await dispatch(
          createNewOfferSagaAction({
            repoId: library.id,
            offer: {
              uuid,
              proximity: 0,
              shareToProximity: data.shareToProximity2 ? 2 : 1,
              tags,
              bodyMarkdown: data.bodyMarkdown || "",
              title: data.title,
              isSeeking: !data.isOffer,
            },
          })
        );
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert(
          "Error creating offer",
          `There was an error creating the offer. Sorry, we're not sure what to suggest here. If this persists, please let us know.\n\n${error.message}`
        );
        return;
      }
      Alert.alert("Saved", "Your offer has been saved.");
      reset();
      setIsSubmitting(false);
    },
    [setIsSubmitting]
  );

  return (
    <View style={styles.container}>
      <Header title="Add something to share" goBack={navigation.goBack} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={[styles.contentContainer, styles.ScrollViewInner]}>
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
          <Text h3 style={styles.doHeader}>
            What do you want to do?
          </Text>

          <View>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <>
                  <RadioButtons
                    options={[
                      { title: "Something to share", value: "1" },
                      { title: "Looking for something", value: "0" },
                    ]}
                    value={value ? "1" : "0"}
                    onChange={(newValue) => onChange(newValue === "1")}
                  />
                  <Text h3 style={styles.itemHeader}>
                    {value
                      ? "What do you want to share?"
                      : "What are you looking for?"}
                  </Text>
                </>
              )}
              name="isOffer"
              rules={{ required: true }}
              defaultValue={true}
            />
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  // label="Offer title"
                  placeholder="Title"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  inputStyle={styles.input}
                  errorStyle={
                    errors.title ? styles.errorText : styles.errorAsHelper
                  }
                  errorMessage={
                    errors.title
                      ? "There is an error in the title"
                      : "eg. Pasta machine"
                  }
                  autoCapitalize="words"
                />
              )}
              name="title"
              rules={{ required: true }}
              defaultValue=""
            />
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  placeholder="Description (optional)"
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  multiline={true}
                  inputStyle={styles.input}
                  errorStyle={
                    errors.bodyMarkdown
                      ? styles.errorText
                      : styles.errorAsHelper
                  }
                  errorMessage={
                    errors.title
                      ? "There is an error in description"
                      : "You can write a brief description so others know what it is."
                  }
                />
              )}
              name="bodyMarkdown"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors.bodyMarkdown && (
              <Text style={styles.errorText}>
                You need to enter some body text
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => {
                const hashed = hashifyTags(parseTags(value));
                return (
                  <Input
                    placeholder="Tags (optional)"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    inputStyle={styles.input}
                    errorStyle={
                      errors.tags ? styles.errorText : styles.errorAsHelper
                    }
                    errorMessage={
                      errors.tags
                        ? "There is an error in the tags"
                        : value.length > 0
                        ? hashed
                        : "You can assign hashtags to assist with searching."
                    }
                  />
                );
              }}
              name="tags"
              defaultValue=""
            />
          </View>

          <Text h3 style={styles.shareHeader}>
            Share settings
          </Text>
          <Controller
            control={control}
            render={({ onChange, value }) => {
              return (
                <RadioButtons
                  options={[
                    { title: "Only friends", value: "0" },
                    { title: "Friends of friends", value: "1" },
                  ]}
                  value={value ? "1" : "0"}
                  onChange={(newValue) => onChange(newValue === "1")}
                />
              );
            }}
            name="shareToProximity2"
            defaultValue={false}
          />

          <View style={styles.formFooter}>
            <Text>
              All done? Pressing "Save and share" will add this to Your Stuff
              and share it with your community.
            </Text>
            <Button
              title="Save and share"
              containerStyle={styles.submitButton}
              icon={
                <Icon
                  name="share-square-o"
                  size={16}
                  style={styles.buttonIcon}
                />
              }
              loading={formState.isSubmitting || isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OfferForm;

const styles = StyleSheet.create({
  ...sharedStyles,
  doHeader: {
    marginBottom: 16,
  },
  itemHeader: {
    marginTop: 32,
    marginBottom: 6,
  },
  shareHeader: {
    marginTop: 32,
    marginBottom: 16,
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    fontSize: 14,
  },
  buttonIcon: {
    marginRight: 10,
  },
  errorAsHelper: {
    // marginTop: -20,
    // marginBottom: 20,
    fontSize: 10,
    color: colours.black,
    fontFamily: montserrat,
    paddingLeft: 0,
    marginLeft: 0,
  },
  errorText: {
    fontSize: 10,
    paddingLeft: 0,
    marginLeft: 0,
    // marginTop: -20,
    // marginBottom: 20,
    color: "red",
    fontFamily: montserrat,
  },
  formFooter: {
    backgroundColor: colours.bggrey,
    // Push the grey background out to the edges of the screen
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginTop: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  submitButton: {
    marginTop: 24,
  },
});
