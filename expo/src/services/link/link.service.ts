import { Alert, Linking } from "react-native";
import urlLib from "url";
import { navigationRef } from "../../root.navref";
import { CONFIG } from "../../shared.constants";
import { rootLogger } from "../log/log.service";
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
      ? `/${senderName}`
      : "";

  return `${WEBSITE_URL}/#/invite/${inviteCode}/${recipientName}${senderSegment}`;
};

export const _handleLink = ({ url }: { url: string }) => {
  // TODO We probably need to queue things here as they might be invoked before
  // the navigator has rendered

  console.log("_handleLink() #PD3mUh", url);
  const { query } = urlLib.parse(url, true);

  if (query === null) {
    return;
  }

  if (typeof navigationRef.current === "undefined") {
    Alert.alert(
      "Error handling link #7Kt10G",
      "It looks like you opened a link, but there was an error handling it. " +
        "You could try clicking it again and see if it works better while the app is already open. " +
        "Sorry for the inconvenience. If the problem repeats, please let us know on telegram."
    );
    return;
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
    }

    // TODO What to do now?
    console.log("Ready to start setup #vx7FGp", {
      token: query.token,
      username: query.username,
    });
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
