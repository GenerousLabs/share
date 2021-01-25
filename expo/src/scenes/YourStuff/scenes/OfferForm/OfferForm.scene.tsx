import { zodResolver } from "@hookform/resolvers/zod";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import { Button, CheckBox, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import * as zod from "zod";
import Header from "../../../../components/Header/Header.component";
import { colours, montserrat } from "../../../../root.theme";
import { selectMyLibraryRepo } from "../../../../services/library/library.selectors";
import { createNewOfferSagaAction } from "../../../../services/library/sagas/createNewOffer.saga";
import { YourStuffStackParameterList } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";
import { generateUuid } from "../../../../utils/id.utils";

const InputSchema = zod.object({
  title: zod.string().nonempty(),
  bodyMarkdown: zod.string(),
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
      await dispatch(
        createNewOfferSagaAction({
          repoId: library.id,
          // repoId: data.repoId,
          offer: {
            uuid,
            proximity: 0,
            shareToProximity: data.shareToProximity2 ? 2 : 1,
            tags: ["digital"],
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
          <Text h3>Offer details</Text>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  // label="Offer title"
                  placeholder="Title of offer"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  errorStyle={
                    errors.title ? styles.errorText : styles.errorAsHelper
                  }
                  errorMessage={
                    errors.title
                      ? "There is an error in the title"
                      : "The name of the offer you are sharing"
                  }
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
                  // label="Enter a description"
                  placeholder="Description of offer"
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  multiline={true}
                  numberOfLines={5}
                  errorStyle={
                    errors.title ? styles.errorText : styles.errorAsHelper
                  }
                  errorMessage={
                    errors.title
                      ? "There is an error in description"
                      : "Description to help others know what this item is"
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

          <Text h3>Share settings</Text>
          <Text style={styles.shareIntro}>
            Soon we're launching the option to share with friends of friends.
            For now, you can save this information and later your friends will
            be able to share some of your offers to their own network.
          </Text>
          <Controller
            control={control}
            render={({ onChange, value }) => {
              return (
                <CheckBox
                  title="Share with friends of friends"
                  checked={value}
                  onPress={() => onChange(!value)}
                />
              );
            }}
            name="shareToProximity2"
            defaultValue={false}
          />
          <Button
            title="Save offer to Your Stuff"
            icon={{ name: "arrow-downward" }}
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
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginVertical: 10,
  },
  errorAsHelper: {
    // marginTop: -20,
    // marginBottom: 20,
    color: colours.black,
    fontFamily: montserrat,
    paddingLeft: 0,
    marginLeft: 0,
  },
  errorText: {
    paddingLeft: 0,
    marginLeft: 0,
    // marginTop: -20,
    // marginBottom: 20,
    color: "red",
    fontFamily: montserrat,
  },
  shareIntro: {
    // fontSize: 16,
  },
});
