import { zodResolver } from "@hookform/resolvers/zod";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import * as zod from "zod";
import Header from "../../components/Header/Header.component";
import { setupSagaAction } from "../../services/setup/setup.state";
import { SetupDrawerParamList } from "../../shared.types";
import { RootDispatch } from "../../store";

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

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.ScrollViewInner}>
          <Text h1>Setup</Text>
          <Text>Welcome to the Generous Share app.</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                label="Protocol"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="protocol"
            defaultValue="http"
          />
          {errors.protocol && <Text>Protocol is a required field</Text>}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                label="Host"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="host"
            defaultValue="192.168.178.59:8000"
          />
          {errors.host && <Text>Host is a required field</Text>}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                label="Username"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
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
                label="Token"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
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
  );
};

export default Setup;

const styles = StyleSheet.create({
  ScrollViewInner: {
    paddingBottom: 200,
  },
  container: {
    flex: 1,
  },
});
