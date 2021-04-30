import { Alert, Linking } from "react-native";
import urlLib from "url";
import { navigationRef } from "../../root.navref";
import { CONFIG } from "../../shared.constants";
import { rootLogger } from "../log/log.service";
import { setRemoteParams } from "../setup/setup.state";
import store from "../store/store.service";

const WEBSITE_URL = CONFIG.websiteUrl;

const log = rootLogger.extend("link");

export const getInviteLink = ({
  inviteCode,
  recipientName,
  senderName,
}: {
  inviteCode: string;
  recipientName: string;
  senderName?: string;
}) => {
  const senderSegment =
    typeof senderName === "string" && senderName.length > 0
      ? `/${globalThis.encodeURIComponent(senderName)}`
      : "";

  return `${WEBSITE_URL}/#/invite/${inviteCode}/${globalThis.encodeURIComponent(
    recipientName
  )}${senderSegment}`;
};

// NOTE: If we trigger an `Alert.alert()` before the splash screen has lifted,
// then the app gets stuck in that state (at least on iOS).
const promptAcceptInvite = ({
  inviteCode,
  senderName,
}: {
  inviteCode: string;
  senderName?: string;
}) => {
  // NOTE: This `Alert.alert()` regularly failed to show during testing.
  // Wrapping it in a `setImmediate()` didn't work, neither did
  // `InteractionManager.runAfterInteractions()`, so in the end, the
  // `setTimeout()` with a timeout of 10ms worked and so I'm leaving it as that.
  // Also, note that to test this, you need to restart the Expo app, I think
  // this is because the `_handleLink()` callback gets bound and on every code
  // reload it binds the new version IN ADDITION TO the existing version.
  setTimeout(() => {
    Alert.alert(
      "Accept invite?",
      "It looks like you just opened an invite link.\n\n" +
        "Do you want to accept it now?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: () => {
            if (navigationRef.current === null) {
              // Error state
              Alert.alert(
                "Error #hyOtgk",
                `There was an error accepting the invite. Please try copying & pasting the invite code instead. Sorry about this. :-(`
              );
              return;
            }
            navigationRef.current.navigate("Connections", {
              screen: "ConnectionsAccept",
              params: {
                inviteCode,
                senderName,
              },
            });
          },
        },
      ]
    );
    // NOTE: Unclear why 10 works here, but 0 doesn't, so leaving it as 10
  }, 10);
};

/**
 * Process a link click. This will be invoked on every app load.
 *
 * There are 2 packages of data that might be passed in the URL. They are a
 * username + token (to authenticate against the remote service) and an
 * inviteCode (to accept an invitation from a friend). These two packages can
 * be passed in the same request.
 */
export const _handleLink = ({ url }: { url: string }) => {
  const { query } = urlLib.parse(url, true);
  log.debug("_handleLink() #TQXOJx", { url, query });

  if (query === null) {
    return;
  }

  // NOTE: Parse `token` before `inviteCode` as we used to set them both, and
  // now we ignore `inviteCode` if `token` is set.
  if (typeof query.token === "string") {
    const isSetupComplete = store.getState().setup.isSetupComplete;
    if (isSetupComplete) {
      log.warn("Got token URL after setup complete #S68ihU");
      return;
    }

    if (typeof query.username !== "string") {
      log.error("Got token URL without username #zkYRTQ");
      Alert.alert(
        "Error in setup #WMHATO",
        "It looks like you opened a link, but there was a problem with the link. " +
          "Please reach out on telegram if this issue repeats."
      );
      return;
    }

    store.dispatch(
      setRemoteParams({
        ...CONFIG.defaultRemote,
        username: query.username,
        token: query.token,
      })
    );
  }

  if (typeof query.inviteCode === "string") {
    // TODO Check if we are in a position to handle invite links or not
    promptAcceptInvite(query as { inviteCode: string; senderName?: string });
  }
};

export const startLinkService = () => {
  Linking.getInitialURL().then((url) => {
    if (typeof url === "string") {
      _handleLink({ url });
    }
  });

  Linking.addEventListener("url", _handleLink);
};
