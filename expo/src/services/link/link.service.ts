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

  const isNavigationRefReady =
    typeof navigationRef.current === "undefined" ||
    navigationRef.current === null;

  /*
  if (
  ) {
    Alert.alert(
      "Error handling link #7Kt10G",
      "It looks like you opened a link, but there was an error handling it. " +
        "You could try clicking it again and see if it works better while the app is already open. " +
        "Sorry for the inconvenience. If the problem repeats, please let us know on telegram."
    );
    return;
  }
  */

  if (typeof query.inviteCode === "string") {
    // TODO Check if we are in a position to handle invite links or not
    Alert.alert(
      "Accept invite?",
      "It looks like you just opened an invite link.\n\n" +
        "Do you want to accept it now?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: () => {
            // TODO Navigate to the accept invite screen
            if (navigationRef.current === null) {
              // Error state
              throw new Error("Unknown error. #xqTu7k");
            }
            navigationRef.current.navigate("Connections", {
              screen: "ConnectionsAccept",
              params: {
                inviteCode: query.inviteCode,
                senderName: query.senderName,
              },
            });
          },
        },
      ]
    );
  }

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
};

export const startLinkService = () => {
  Linking.getInitialURL().then((url) => {
    if (typeof url === "string") {
      _handleLink({ url });
    }
  });

  Linking.addEventListener("url", _handleLink);
};
