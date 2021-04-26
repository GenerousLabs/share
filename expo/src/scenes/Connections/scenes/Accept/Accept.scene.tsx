import { zodResolver } from "@hookform/resolvers/zod";
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import * as zod from "zod";
import Header from "../../../../components/Header/Header.component";
import { acceptInviteSagaAction } from "../../../../services/connection/sagas/acceptInvite.saga";
import { rootLogger } from "../../../../services/log/log.service";
import { sharedStyles } from "../../../../shared.styles";
import { ConnectionsStackParameterList } from "../../../../shared.types";
import { RootDispatch, RootState } from "../../../../store";

const log = rootLogger.extend("Accept");
const inviteCodeRegex = new RegExp(
  "[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+_[a-zA-Z0-9]{8,}"
);

const InputsSchema = zod.object({
  name: zod.string().nonempty(),
  notes: zod.string(),
  inviteCode: zod.string().nonempty().regex(inviteCodeRegex),
});
type Inputs = zod.infer<typeof InputsSchema>;

const Accept = ({
  route,
  navigation,
}: {
  route: RouteProp<ConnectionsStackParameterList, "ConnectionsAccept">;
  navigation: StackNavigationProp<
    ConnectionsStackParameterList,
    "ConnectionsAccept"
  >;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm({
    resolver: zodResolver(InputsSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data: Inputs) => {
      setIsSubmitting(true);
      log.debug("Got accept params #ORqBDG", data);

      const { inviteCode, ...rest } = data;

      try {
        await dispatch(
          acceptInviteSagaAction({
            ...rest,
            postofficeCode: inviteCode,
          })
        );
      } catch (error) {
        const errorText =
          "error" in error && "toString" in error.error
            ? error.error.toString()
            : "Unknown error. Please report this via telegram. #yLMP1O";
        Alert.alert("Error accepting invite #sx61Dj", errorText);
        return;
      }

      Alert.alert("Connected", "You are connected.");
      navigation.navigate("ConnectionsHome");
    },
    [dispatch]
  );

  const inviteCode = route.params?.inviteCode || "";
  const senderName = route.params?.senderName || "";

  return (
    <View style={styles.container}>
      <Header
        title="Accept invite"
        goBack={() => navigation.navigate("ConnectionsHome")}
      />
      <View style={styles.contentContainer}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.ScrollViewInner}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  placeholder="Code"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  autoCapitalize="none"
                  autoCompleteType="password"
                  errorMessage={
                    errors.inviteCode && "There's an error in your invite code."
                  }
                />
              )}
              name="inviteCode"
              rules={{ required: true }}
              defaultValue={inviteCode}
            />

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  placeholder="Name"
                  inputStyle={styles.input}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  autoCapitalize="words"
                  errorMessage={errors.name && "Name is a required field"}
                />
              )}
              name="name"
              defaultValue={senderName}
            />

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  placeholder="Notes"
                  inputStyle={styles.input}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  multiline={true}
                  errorMessage={
                    errors.notes &&
                    "There's an error in your note, sorry, we don't know what it is, we really didn't expect you to see this message."
                  }
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
    fontSize: 14,
  },
  authButtonWrapper: {
    marginTop: 40,
  },
  errorText: {
    fontSize: 12,
    marginTop: 0,
  },
});
