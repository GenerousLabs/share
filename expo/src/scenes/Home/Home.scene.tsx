import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Input, Text } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header.component";
import Markdown from "../../components/Markdown/Markdown.component";
import WarningBox from "../../components/WarningBox/WarningBox.component";
import { selectAllConnectionsCount } from "../../services/connection/connection.state";
import { rootLogger } from "../../services/log/log.service";
import { selectMeRepo } from "../../services/repo/repo.state";
import { sharedStyles } from "../../shared.styles";
import { RootDrawerParamList } from "../../shared.types";
import { RootState } from "../../store";

const log = rootLogger.extend("Home");

const md = `This app is very much a work in progress.

If you have issues, please reach out on the telegram group and we'll do our best to help.
`;

const PasswordCard = ({ password }: { password: string }) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <Card containerStyle={styles.box}>
        <Card.Title style={styles.bold}>Back up this password.</Card.Title>
        <Text>
          These are the key sot your account. You will need it if you ever lose
          your phone or delete your Generous app.
        </Text>
        <Input value={password} errorStyle={styles.passwordInput} />
      </Card>
    </TouchableOpacity>
  );
};

const InviteWaitingCard = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Home">;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        // NOTE: This call does work, but the typing is not in place for
        // TypeScript to understand which routes are available on the
        // `Connections` scene. It might be possible to fix the types, but for
        // now, hacking with cast to any.
        (navigation.navigate as any)("Connections", {
          screen: "ConnectionsAccept",
        });
      }}
    >
      <Card containerStyle={styles.box}>
        <Card.Title style={styles.bold}>You have an invite waiting.</Card.Title>
        <Text>Tap here to reply to your invitation.</Text>
      </Card>
    </TouchableOpacity>
  );
};

const InviteReminderCard = () => {
  return (
    <Card containerStyle={styles.box}>
      <Card.Title style={styles.bold}>
        Did somebody send you an invite?
      </Card.Title>
      <Text>
        You can accept their invitation by clicking the link they sent you.
      </Text>
    </Card>
  );
};

const Home = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<RootDrawerParamList, "Home">;
}) => {
  const meRepo = useSelector(selectMeRepo);
  const inviteCodes = useSelector(
    (state: RootState) => state.setup.inviteCodes
  );
  const connectionCount = useSelector(selectAllConnectionsCount);
  const hasInvitesWaiting = inviteCodes.length > 0;
  const hasConnections = connectionCount > 0;
  const showInviteReminder = !hasInvitesWaiting && !hasConnections;

  if (typeof meRepo === "undefined") {
    // This should not happen, something went wrong
    return null;
  }
  const [, password] = meRepo.remoteUrl.split("::");

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <ScrollView>
          <WarningBox />
          <PasswordCard password={password} />
          {hasInvitesWaiting ? (
            <InviteWaitingCard navigation={navigation} />
          ) : null}
          {showInviteReminder ? <InviteReminderCard /> : null}
          <Markdown content={md} />
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  ...sharedStyles,
  box: {
    marginHorizontal: 0,
  },
  passwordInput: {
    height: 0,
  },
});
