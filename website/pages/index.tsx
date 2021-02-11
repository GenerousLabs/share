import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const hostname = process.env.hostname;

type UrlData =
  | {
      type: "token";
      token: string;
      username: string;
      name?: string;
    }
  | {
      type: "invite";
      inviteCode: string;
      recipientName: string;
      senderName?: string;
    };

type UrlState = Partial<{
  token: string;
  username: string;
  name: string;
  inviteCode: string;
  recipientName: string;
  senderName: string;
}>;

const getUrlParams = ({ hash }: { hash: string }): UrlData => {
  const [
    ,
    type,
    credential,
    recipientNameOrUsername,
    senderNameOrName,
  ] = hash.split("/");
  if (type === "token") {
    return {
      type,
      token: credential,
      username: recipientNameOrUsername,
      name: senderNameOrName,
    };
  }
  if (type === "invite") {
    return {
      type,
      inviteCode: credential,
      recipientName: recipientNameOrUsername,
      senderName: senderNameOrName,
    };
  }
};

const STORAGE_KEY = "__generousShareParams";

const persistUrlState = (state: UrlState) => {
  if ("localStorage" in globalThis === false) {
    return;
  }
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadUrlState = (): UrlState => {
  if ("localStorage" in globalThis === false) {
    return {};
  }
  const json = globalThis.localStorage.getItem(STORAGE_KEY);
  if (json === null) {
    return {};
  }
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Error parsing stored state #CWY6Hc");
    return {};
  }
};

const getName = (state: UrlState) => {
  if (
    typeof state.recipientName === "string" &&
    state.recipientName.length > 0
  ) {
    return state.recipientName;
  }
  if (typeof state.name === "string" && state.name.length > 0) {
    return state.name;
  }
  if (typeof state.username === "string" && state.username.length > 0) {
    return state.username;
  }
  return "";
};

const Home = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [urlState, setUrlState] = useState<UrlState>(() => loadUrlState());
  const [isExistingUser, setIsExistingUser] = useState<boolean>(undefined);

  const readHash = useCallback(() => {
    const params = getUrlParams({ hash: window.location.hash });
    if (typeof params === "undefined") {
      return;
    }
    const { type, ...rest } = params;
    const newState = { ...urlState, ...rest };
    setUrlState(newState);
    persistUrlState(newState);

    setIsBooting(false);
  }, [setIsBooting, setUrlState]);

  useEffect(() => {
    readHash();
    window.onpopstate = () => readHash();
  }, []);

  const { token, username, inviteCode } = urlState;
  const name = getName(urlState);
  const senderName =
    typeof urlState.senderName === "string" ? urlState.senderName : "A Friend";

  const showToken = typeof token === "string" && token.length > 0;
  const showInvite =
    !showToken && typeof inviteCode === "string" && inviteCode.length > 0;

  const showGeneric = isBooting || (!showToken && !showInvite);

  if (showGeneric) {
    return (
      <div className={styles.Wrapper}>
        <Head>
          <title>Generous Share</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.App}>
          <h1>Generous Share</h1>
          <p>
            If you're already setup, launch the Generous Share app here. If not,
            find a friend to invite you.
          </p>
          <p>
            <a className={styles.buttonLink} href={`exps://${hostname}/`}>
              Click here to accept the invitation
            </a>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.Wrapper}>
      <Head>
        <title>Generous Share</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.App}>
        <h1>Generous Share</h1>
        {!showInvite ? null : (
          <>
            <p>Hey {name}, welcome to the revolution.</p>
            <p>
              {senderName} has invited you to join the Generous Share
              revolution.
            </p>
            <p>
              Do you already have the Generous Share app installed and setup?
            </p>
            <p>
              <button
                className={styles.button}
                onClick={() => {
                  setIsExistingUser(true);
                }}
              >
                Yes
              </button>{" "}
              <button
                className={styles.button}
                onClick={() => {
                  setIsExistingUser(false);
                }}
              >
                No
              </button>
            </p>
            {typeof isExistingUser === "undefined" ? null : isExistingUser ? (
              <>
                <p>AWESOME! - Welcome back</p>
                <p>
                  <a
                    className={styles.buttonLink}
                    href={`exps://${hostname}/?inviteCode=${inviteCode}`}
                  >
                    Click here to accept the invitation
                  </a>
                </p>
              </>
            ) : (
              <>
                <p>No? - No worries, we'll be happy to help you get setup.</p>
                <p>
                  The process is a little convoluted. Unfortunately this kind of
                  revolutionary software requires a little work.
                </p>
                <p>
                  To get started, join the{" "}
                  <a
                    href="https://t.me/joinchat/T3LiaaNN-eHTCTVh"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Generous telegram group
                  </a>
                  . Post a message and say "I want an account with username
                  xxx". Choose whatever username you like, we'll let you know if
                  it's not available.
                </p>
                <p>
                  Somebody will create an account for you and send you an
                  installation link. It's a manual process, so unfortunately you
                  might need to wait a day or two.
                </p>
              </>
            )}
          </>
        )}
        {!showToken ? null : (
          <>
            <p>Hey {name}, welcome to the revolution.</p>
            <p>
              Installing the Generous Share app is a bit more involved than the
              usual app. That's because it's built for humanity rather than
              profit. We're working on making it easier, please bear with us in
              the meantime.
            </p>
            <p>
              The app is built on top of something called expo. The first step
              is to install Expo Go.
            </p>
            <p>
              <a
                href="https://itunes.apple.com/app/apple-store/id982107779"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buttonLink}
              >
                Install for iOS
              </a>{" "}
              -{" "}
              <a
                href="https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buttonLink}
              >
                Install for Android
              </a>
            </p>
            <p>
              After you've installed Expo Go, come back to this page, and then
              you're ready to launch Generous Share inside Expo Go. Confused?
              Sorry, we're working on making it easier, but usurping the man is
              a hard task! You can always come back to this page, it's tailored
              just for you {name}.
            </p>
            <p>
              <a
                href={`exps://${hostname}/?username=${username}&token=${token}${
                  typeof inviteCode === "string"
                    ? `&invitecode=${inviteCode}`
                    : ""
                }`}
                className={styles.buttonLink}
              >
                Launch {name}'s Generous Share app (inside Expo Go)
              </a>
            </p>
            <p>
              This link is PRIVATE. It includes your secret tokens. We recommend
              you don't share it.
            </p>
            <p>
              When you launch for the first time, you'll see a welcome message
              from Expo Go. You can safely ignore that. The first time you
              launch, and anytime you shake your phone with Expo Go open, you'll
              see the developer menu. Again, you can safely close and ignore it.
              Be careful with the "Home" or "Reload" buttons in that menu
              though, if you reload, anything you're working on won't be saved.
              Sorry, we know this is so 1999.
            </p>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
