import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Input, Text, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import Header from "../../../../components/Header/Header.component";
import { acceptInviteSagaAction } from "../../../../services/connection/connection.saga";
import { rootLogger } from "../../../../services/log/log.service";
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
  const [inviteCode, setInviteCode] = useState("");

  const onSubmit = useCallback(
    async (data: Inputs) => {
      setIsSubmitting(true);
      log.debug("Got accept params #ORqBDG", data);
      const { confirmCode } = await dispatch(acceptInviteSagaAction(data));
      setInviteCode(confirmCode);
      setIsSubmitting(false);
    },
    [dispatch, setInviteCode]
  );

  return (
    <View>
      <Header title="Accept invite" goBack={navigation.goBack} />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
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
              <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <Input
                    label="Code"
                    style={styles.inputMultiline}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    multiline={true}
                    numberOfLines={12}
                  />
                )}
                name="inviteCode"
                rules={{ required: false }}
                defaultValue=""
              />
              <Button
                loading={isSubmitting}
                title="Accept Invitation"
                onPress={handleSubmit(onSubmit)}
              />
            </>
          ) : (
            <>
              <Text h2>Confirm your invitation</Text>
              <Text>
                Send this confirmation code back to your friend to confirm the
                invitation.
              </Text>
              <Input value={inviteCode} multiline numberOfLines={12} />
            </>
          )}
          <Button
            title="< Back to Connections"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Accept;

const styles = StyleSheet.create({
  ScrollViewInner: {
    // Extend the view until we fix the ScrollViewHeight issue
    paddingBottom: 200,
  },
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
