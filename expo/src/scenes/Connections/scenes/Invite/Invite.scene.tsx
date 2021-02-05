import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { createInviteSagaAction } from "../../../../services/connection/sagas/createInvite.saga";
import { sharedStyles } from "../../../../shared.styles";
import { ConnectionsStackParameterList } from "../../../../shared.types";
import { RootDispatch } from "../../../../store";

type Inputs = {
  name: string;
  notes: string;
};

const Invite = ({
  navigation,
}: {
  navigation: StackNavigationProp<
    ConnectionsStackParameterList,
    "ConnectionsInvite"
  >;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm<Inputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [connectionName, setConnectionName] = useState("");

  const onSubmit = useCallback(
    async (data: Inputs) => {
      setIsSubmitting(true);
      const { postofficeCode } = await dispatch(createInviteSagaAction(data));
      setConnectionName(data.name);
      setInviteCode(postofficeCode);
      setIsSubmitting(false);
    },
    [dispatch, setInviteCode, setConnectionName]
  );

  return (
    <View style={styles.container}>
      <Header title="Invite" goBack={navigation.goBack} />
      <View style={styles.contentContainer}>
        <ScrollView>
          <View style={styles.ScrollViewInner}>
            {inviteCode === "" ? (
              <>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Input
                      placeholder="Name (only seen by you)"
                      inputStyle={styles.input}
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
                      placeholder="Notes (optional)"
                      inputStyle={styles.input}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      multiline={true}
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
                <Text>
                  Share this code with{" "}
                  <Text style={{ fontWeight: "bold" }}>{connectionName}</Text>
                </Text>
                <Input value={inviteCode} />
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Invite;

const styles = StyleSheet.create({
  ...sharedStyles,
  input: {
    fontSize: 14,
  },
  authButtonWrapper: {
    marginTop: 40,
  },
});
