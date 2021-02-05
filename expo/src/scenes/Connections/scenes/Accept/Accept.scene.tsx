import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Input, Text, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { acceptInviteSagaAction } from "../../../../services/connection/sagas/acceptInvite.saga";
import { rootLogger } from "../../../../services/log/log.service";
import { sharedStyles } from "../../../../shared.styles";
import { ConnectionsStackParameterList } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";

const log = rootLogger.extend("Accept");

type Inputs = {
  name: string;
  notes: string;
  inviteCode: string;
};

const Accept = ({
  navigation,
}: {
  navigation: StackNavigationProp<
    ConnectionsStackParameterList,
    "ConnectionsAccept"
  >;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const onSubmit = useCallback(
    async (data: Inputs) => {
      setIsSubmitting(true);
      log.debug("Got accept params #ORqBDG", data);

      const { inviteCode, ...rest } = data;

      await dispatch(
        acceptInviteSagaAction({
          ...data,
          postofficeCode: inviteCode,
        })
      );

      setIsFinished(true);
      setIsSubmitting(false);
    },
    [dispatch, setIsFinished]
  );

  return (
    <View style={styles.container}>
      <Header title="Accept invite" goBack={navigation.goBack} />
      <View style={styles.contentContainer}>
        <ScrollView>
          <View style={styles.ScrollViewInner}>
            {isFinished ? (
              <>
                <Text h2>Connected</Text>
                <Text>You are connected</Text>
              </>
            ) : (
              <>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Input
                      label="Code"
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      autoCapitalize="none"
                      autoCompleteType="password"
                    />
                  )}
                  name="inviteCode"
                  rules={{ required: false }}
                  defaultValue=""
                />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Input
                      label="Name"
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="name"
                  defaultValue=""
                />
                {errors.name && <Text>Name is a required field</Text>}
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Input
                      label="Notes"
                      style={styles.inputMultiline}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      multiline={true}
                      numberOfLines={5}
                    />
                  )}
                  name="notes"
                  rules={{ required: false }}
                  defaultValue=""
                />
                <Button
                  loading={isSubmitting}
                  title="Accept Invitation"
                  onPress={handleSubmit(onSubmit)}
                />
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Accept;

const styles = StyleSheet.create({
  ...sharedStyles,
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
