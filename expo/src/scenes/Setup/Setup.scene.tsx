import { zodResolver } from "@hookform/resolvers/zod";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import Constants from "expo-constants";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import * as zod from "zod";
import Header from "../../components/Header/Header.component";
import Markdown from "../../components/Markdown/Markdown.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { colours } from "../../root.theme";
import { setupSagaAction } from "../../services/setup/setup.state";
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
      host: `${devHost}:${DEV_SERVER_PORT}`,
    }
  : CONFIG.defaultRemote;

const Schema = zod.object({
  protocol: zod.string().nonempty(),
  host: zod.string().nonempty(),
  token: zod.string().nonempty(),
  username: zod.string().nonempty(),
  name: zod.string().nonempty(),
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
    (data: Inputs) => {
      setHasSetupStarted(true);
      const { name, ...remote } = data;
      dispatch(setupSagaAction({ config: { name, remote } }));
    },
    [dispatch, setupSagaAction, setHasSetupStarted]
  );

  const defaultUsername =
    typeof setup.remoteParams !== "undefined"
      ? setup.remoteParams.username
      : "";
  const defaultToken =
    typeof setup.remoteParams !== "undefined" ? setup.remoteParams.token : "";

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

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <Input
                  placeholder="Your name"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  autoCapitalize="words"
                  autoCompleteType="name"
                  errorMessage={
                    errors.name &&
                    "Sorry, setup requires a name. Feel free to make one up."
                  }
                />
              )}
              name="name"
              defaultValue=""
            />

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => {
                if (value === defaultValues.protocol) {
                  return (
                    <View>
                      <Pressable
                        onLongPress={() => onChange("")}
                        delayLongPress={2e3}
                      >
                        <Text style={styles.defaultValueText}>
                          Protocol: {defaultValues.protocol}
                        </Text>
                      </Pressable>
                    </View>
                  );
                }

                return (
                  <Input
                    labelStyle={styles.inputLabel}
                    placeholder="Protocol"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    errorMessage={
                      errors.protocol && "A protocol is required for setup."
                    }
                  />
                );
              }}
              name="protocol"
              defaultValue={defaultValues.protocol}
            />

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => {
                if (value === defaultValues.host) {
                  return (
                    <View>
                      <Pressable
                        onLongPress={() => onChange("")}
                        delayLongPress={2e3}
                      >
                        <Text style={styles.defaultValueText}>
                          Host: {defaultValues.host}
                        </Text>
                      </Pressable>
                    </View>
                  );
                }

                return (
                  <Input
                    labelStyle={styles.inputLabel}
                    placeholder="Host"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    errorMessage={
                      errors.host && "A host is required for setup."
                    }
                  />
                );
              }}
              name="host"
              defaultValue={defaultValues.host}
            />

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => {
                if (value === "" && defaultUsername.length > 0) {
                  console.log("Setting username after first paint #bXUFiD");
                  onChange(defaultUsername);
                }

                if (value === defaultUsername && value.length > 0) {
                  return (
                    <View>
                      <Pressable
                        onLongPress={() => onChange("")}
                        delayLongPress={2e3}
                      >
                        <Text style={styles.defaultValueText}>
                          Username: {defaultUsername}
                        </Text>
                      </Pressable>
                    </View>
                  );
                }

                return (
                  <Input
                    placeholder="Username"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    autoCapitalize="none"
                    autoCompleteType="username"
                    errorMessage={
                      errors.username && "A username is required for setup."
                    }
                  />
                );
              }}
              name="username"
              defaultValue={defaultUsername}
            />

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => {
                if (value === "" && defaultToken.length > 0) {
                  console.log("Setting token after first paint #Fjx2uC");
                  onChange(defaultToken);
                }

                if (value === defaultToken && value.length > 0) {
                  return (
                    <View>
                      <Pressable
                        onLongPress={() => onChange("")}
                        delayLongPress={2e3}
                      >
                        <Text style={styles.defaultValueText}>
                          Token: {defaultToken}
                        </Text>
                      </Pressable>
                    </View>
                  );
                }

                return (
                  <Input
                    placeholder="Token"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    autoCapitalize="none"
                    autoCompleteType="password"
                    errorMessage={
                      errors.token && "A token is required for setup."
                    }
                  />
                );
              }}
              name="token"
              defaultValue={defaultToken}
            />

            <Button
              title="Startup setup"
              loading={formState.isSubmitting || hasSetupStarted}
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              containerStyle={styles.submitButton}
            />
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
  defaultValueText: {
    color: colours.grey5,
    marginVertical: 3,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 0,
    paddingBottom: 0,
  },
  submitButton: {
    marginTop: 12,
  },
});
