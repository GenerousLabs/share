import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { useDispatch } from "react-redux";
import { createInviteSagaAction } from "../../../../services/connection/connection.saga";
import { RootDispatch } from "../../../../store";

type Inputs = {
  name: string;
  notes: string;
};

const Invite = () => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const onSubmit = useCallback(
    async (data: Inputs) => {
      setIsSubmitting(true);
      const { inviteCode } = await dispatch(createInviteSagaAction(data));
      setInviteCode(inviteCode);
      setIsSubmitting(false);
    },
    [dispatch, setInviteCode]
  );

  return (
    <View>
      {inviteCode === "" ? (
        <>
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
            title="Generate an invite code"
            onPress={handleSubmit(onSubmit)}
          />
        </>
      ) : (
        <>
          <Text h2>Invite a friend</Text>
          <Text>Share this code with a friend</Text>
          <Input value={inviteCode} multiline numberOfLines={12} />
        </>
      )}
    </View>
  );
};

export default Invite;

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