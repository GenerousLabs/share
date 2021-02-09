import { zodResolver } from "@hookform/resolvers/zod";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import Constants from "expo-constants";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import * as zod from "zod";
import Header from "../../components/Header/Header.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { colours } from "../../root.theme";
import { setupSagaAction } from "../../services/setup/setup.state";
import { sharedStyles } from "../../shared.styles";
import { SetupDrawerParamList } from "../../shared.types";
import { RootDispatch, RootState } from "../../store";

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
  : {
      protocol: "https",
      host: "share.generous.software",
    };

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
    (data: Inputs) => {
      setHasSetupStarted(true);
      dispatch(
        setupSagaAction({
          config: {
            remote: { ...data },
          },
        })
      );
    },
    [dispatch, setupSagaAction]
  );

  if (setup.didSetupFail) {
    return (
      <View>
        <Header />
        <ScrollView>
          <Text h1>Error</Text>
          <Text>There was an error during setup.</Text>
          <Text>
            Unfortunately we're not sure what to suggest at this point. This app
            is still in early testing. Please reach out to us and send a
            screenshot of this error, we'll do our best to help.
          </Text>
          <Text style={styles.errorText}>
            {setup.setupError ? JSON.stringify(setup.setupError) : ""}
          </Text>
        </ScrollView>
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
            <Text>Welcome to the Generous Share app.</Text>
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
            <Button
              title="Startup setup"
              loading={formState.isSubmitting || hasSetupStarted}
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
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
    color: colours.grey5,
  },
});
