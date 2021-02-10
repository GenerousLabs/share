import { zodResolver } from "@hookform/resolvers/zod";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import Constants from "expo-constants";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import * as zod from "zod";
import Header from "../../components/Header/Header.component";
import Markdown from "../../components/Markdown/Markdown.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { colours } from "../../root.theme";
import {
  setName,
  setRemoteParams,
  setSetupCompleteAction,
  setupSagaAction,
} from "../../services/setup/setup.state";
import { CONFIG } from "../../shared.constants";
import { sharedStyles } from "../../shared.styles";
import { SetupDrawerParamList } from "../../shared.types";
import { RootDispatch, RootState } from "../../store";

const welcomeMessage = `Welcome to the Generous Share app.

This setup process might take a minute or two.

This app keeps everything entirely on your phone. It saves only an encrypted
copy on the server. That means your phone is the boss.

It also means that after the setup, you'll need to save a password. **This
password is the only way to recover your account.** If you ever lose it, and
lose your phone, then there's no way to get your account back. You will have
to start over.
`;

// The port to OUR server application, not the expo server
const DEV_SERVER_PORT = "8000";

const [devHost] =
  typeof Constants.manifest.debuggerHost === "string"
    ? Constants.manifest.debuggerHost.split(":")
    : ":";

const defaultValues = __DEV__
  ? {
      protocol: "http",
      host: `${devHost}:8000`,
    }
  : CONFIG.defaultRemote;

const Schema = zod.object({
  protocol: zod.string().nonempty(),
  host: zod.string().nonempty(),
  token: zod.string().nonempty(),
  username: zod.string().nonempty(),
});
type Inputs = zod.infer<typeof Schema>;

const Setup = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<SetupDrawerParamList>;
}) => {
  const dispatch: RootDispatch = useDispatch();
  const setup = useSelector((state: RootState) => state.setup);
  const [hasSetupStarted, setHasSetupStarted] = useState(false);
  const { control, handleSubmit, errors, reset, formState } = useForm({
    resolver: zodResolver(Schema),
  });

  const onSubmit = useCallback(
    (data?: Inputs) => {
      setHasSetupStarted(true);
      if (typeof data !== "undefined") {
        dispatch(setRemoteParams(data));
      }
      dispatch(setupSagaAction());
    },
    [dispatch, setupSagaAction, setHasSetupStarted]
  );

  // If the remote params we require for setup are already in redux, then we can
  // hide the form that requests them.
  // TODO Allow users to edit remote params behind a switch
  const hasRemoteParams = typeof setup.remoteParams !== "undefined";
  console.log("Setup.scene #KZHyEM", hasRemoteParams);

  const remoteParamsMarkdown =
    typeof setup.remoteParams === "undefined"
      ? ""
      : `Your parameters are:  
Protocol: ${setup.remoteParams.protocol}  
Host: ${setup.remoteParams.host}  
Username: ${setup.remoteParams.username}  
Token: ${setup.remoteParams.token}`;

  if (setup.didSetupFail) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.contentContainer}>
          <ScrollView>
            <View style={styles.ScrollViewInner}>
              <Text h1>Error</Text>
              <Text>There was an error during setup.</Text>
              <Text>
                Unfortunately we're not sure what to suggest at this point. This
                app is still in early testing. Please reach out to us and send a
                screenshot of this error, we'll do our best to help.
              </Text>
              <Text style={styles.errorText}>
                {setup.setupError ? JSON.stringify(setup.setupError) : ""}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <ScrollView>
          <View style={styles.ScrollViewInner}>
            <WarningBox />
            <Markdown content={welcomeMessage} />
            {hasRemoteParams ? null : (
              <>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Input
                      placeholder="Protocol"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="protocol"
                  defaultValue={defaultValues.protocol}
                />
                {errors.protocol && <Text>Protocol is a required field</Text>}
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Input
                      placeholder="Host"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="host"
                  defaultValue={defaultValues.host}
                />
                {errors.host && <Text>Host is a required field</Text>}
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Input
                      placeholder="Username"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      autoCapitalize="none"
                      autoCompleteType="username"
                    />
                  )}
                  name="username"
                  defaultValue=""
                />
                {errors.username && <Text>Username is a required field</Text>}
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <Input
                      placeholder="Token"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      autoCapitalize="none"
                      autoCompleteType="password"
                    />
                  )}
                  name="token"
                  defaultValue=""
                />
                {errors.token && <Text>Token is a required field</Text>}
              </>
            )}
            <Input
              placeholder="Your name"
              onChangeText={(value) => dispatch(setName({ name: value }))}
              autoCapitalize="words"
              autoCompleteType="name"
            />
            <Button
              title="Startup setup"
              loading={formState.isSubmitting || hasSetupStarted}
              onPress={() => {
                // Do not submit the form unless a name has been entered
                if (typeof setup.name !== "string" || setup.name.length === 0) {
                  Alert.alert("Please enter a name");
                  return;
                }

                if (hasRemoteParams) {
                  onSubmit();
                } else {
                  // NOTE: `onSubmit()`'s argument is optional here, which
                  // doesn't fit the required type signature for
                  // `handleSubmit()` so we cast it to any as a hack.
                  handleSubmit(onSubmit as any)();
                }
              }}
            />
            {!hasRemoteParams ? null : (
              <Text style={styles.remoteParams}>{remoteParamsMarkdown}</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Setup;

const styles = StyleSheet.create({
  ...sharedStyles,
  errorText: {
    marginTop: 20,
    color: colours.grey5,
  },
  remoteParams: {
    marginTop: 20,
    color: colours.grey5,
  },
});
