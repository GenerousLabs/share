import Bowser from "bowser";
import classnames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const hostname = process.env.hostname;
const version = process.env.version;
const url = `exps://${hostname}/expo/`;
const telegramGroupUrl = "https://t.me/joinchat/T3LiaaNN-eHTCTVh";

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

const IS_EXISTING_USER_STORAGE_KEY = "__generousShareIsExistingUser";

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

const persistIsExistingUser = (isExistinguser: boolean) => {
  if ("localStorage" in globalThis === false) {
    return;
  }
  globalThis.localStorage.setItem(
    IS_EXISTING_USER_STORAGE_KEY,
    isExistinguser ? "1" : "0"
  );
};

const loadIsExistingUser = () => {
  if ("localStorage" in globalThis === false) {
    return;
  }
  const storedVal = globalThis.localStorage.getItem(
    IS_EXISTING_USER_STORAGE_KEY
  );
  if (storedVal === "0") {
    return false;
  }
  if (storedVal === "1") {
    return true;
  }
};

const isMobile =
  typeof window === "undefined"
    ? true
    : Bowser.parse(window.navigator.userAgent).platform.type === "mobile";

enum View {
  generic = "generic",
  token = "token",
  invite = "invite",
}

const GotQuestions = () => {
  return (
    <>
      <p>
        Still got questions?
        <br />
        Hit us up on telegram.
      </p>
      <p>
        <a href={telegramGroupUrl} target="_blank" rel="noopener noreferrer">
          Generous Share Telegram Group
        </a>
      </p>
    </>
  );
};

const Home = () => {
  const [showView, setShowView] = useState(View.generic);
  const [urlState, setUrlState] = useState<UrlState>(() => {
    if (typeof window !== "undefined") {
      getUrlParams({ hash: window.location.hash });
    }
    return {};
  });
  const [isExistingUser, _setIsExistingUser] = useState<boolean>(() =>
    loadIsExistingUser()
  );
  const [hideOverlay, setHideOverlay] = useState(isMobile);

  const readHash = useCallback(() => {
    const params = getUrlParams({ hash: window.location.hash });
    if (typeof params === "undefined") {
      return;
    }
    const { type, ...rest } = params;
    const newState = { ...urlState, ...rest };
    setUrlState(newState);

    setShowView(View[type]);
  }, [setUrlState]);

  const setIsExistingUser = useCallback(
    (isExistingUser) => {
      _setIsExistingUser(isExistingUser);
      persistIsExistingUser(isExistingUser);
    },
    [_setIsExistingUser]
  );

  useEffect(() => {
    readHash();
    window.onpopstate = () => readHash();
  }, []);

  const { token, username, inviteCode } = urlState;
  const name = getName(urlState);
  const senderName =
    typeof urlState.senderName === "string" ? urlState.senderName : "A Friend";

  return (
    <div className="appWrapper">
      <Head>
        <title>Generous Share</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>Generous Share</h1>
      </header>

      {hideOverlay ? null : (
        <div className={styles.overlayWrapper}>
          <div className={styles.overlayContainer}>
            <h3>It looks like you've opened this link on a computer</h3>
            <p>
              For the buttons to work, you need to be on the phone where you use
              the Generous Share app.
            </p>
            <button
              className={styles.overlayButton}
              onClick={() => setHideOverlay(true)}
            >
              OK, got it.
            </button>
          </div>
        </div>
      )}

      <main className="appContainer">
        <div className="logoContainer">
          <Image src="/_static/logo.png" height="46" width="41" />
        </div>

        {showView === View.generic && (
          <>
            <h2>
              Welcome to the
              <br />
              <span className="h2SecondLine">revolution</span>
            </h2>
            <p className="buttonLinkP">
              <a className="buttonLink" href={url}>
                Launch Your Generous App inside Expo
              </a>
            </p>
            <hr />
            <GotQuestions />
          </>
        )}

        {showView === View.invite && (
          <>
            <h2>
              {name}, <span className="nobreak">welcome to the</span>
              <br />
              <span className="h2SecondLine">revolution.</span>
            </h2>
            <p>
              {senderName} has invited you to join the Generous Share
              revolution.
            </p>
            <hr />
            <h4>Do you have the Generous App already?</h4>
            <p>
              Installing the Generous Share App is a bit more involved than the
              usual app installation process, so you would remember if you have
              done it. Have you?
            </p>
            <p>
              <button
                className={classnames([
                  styles.button,
                  isExistingUser === true ? styles.buttonSelected : null,
                ])}
                onClick={() => {
                  setIsExistingUser(true);
                }}
              >
                Yes
              </button>{" "}
              <button
                className={classnames([
                  styles.button,
                  isExistingUser === false ? styles.buttonSelected : null,
                ])}
                onClick={() => {
                  setIsExistingUser(false);
                }}
              >
                No
              </button>
            </p>
            {isExistingUser === true && (
              <div className={styles.afterAnswerBox}>
                <p>Awesome, welcome back!</p>
                <p className="buttonLinkP">
                  <a href={`${url}?inviteCode=${inviteCode}`}>
                    {senderName.length > 0
                      ? `Accept ${senderName}'s friend invitation`
                      : `Accept the invitation`}
                  </a>
                </p>
                <p className={styles.inviteCode}>
                  Invitation code: {inviteCode}
                </p>
              </div>
            )}
            {isExistingUser === false && (
              <div className={styles.afterAnswerBox}>
                <p>
                  <strong>OK then, let’s get you setup!</strong>
                </p>
                <p>
                  The process is a little confusing at times but we will walk
                  you through it. This kind of revolutionary software requires a
                  little patience from you and some magic from us.
                </p>
                <p>
                  First, you’ll need a username. Request one on our community
                  Telegram group. Post a message and say "I would like an
                  account with [insert awesome username here]". Choose whatever
                  username you like, we'll let you know if it's not available.
                </p>
                <p>
                  Somebody will create an account for you and send you a unique
                  installation link. It's a manual process, so unfortunately you
                  might need to wait a little until someone is available to
                  respond.
                </p>
                <p className="buttonLinkP">
                  <a
                    href={telegramGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Generous telegram group
                  </a>
                </p>
              </div>
            )}
          </>
        )}
        {showView === View.token && (
          <>
            <h2>
              {name}, welcome to the <br />
              <span className="h2SecondLine">revolution.</span>
            </h2>
            <p>
              This is your unique page. It has instructions to ensure a smooth
              onboarding process. Consider saving it and don’t share it with
              others.
            </p>
            <p className="blackHighlight">
              Installing the Generous Share app is a bit more involved than the
              usual app. That's because it's built for humanity rather than
              profit. We're working on making it easier, please bear with us in
              the meantime.
            </p>
            <div className={styles.stepHeaderWrapper}>
              <h3>Step 1: Download Expo Go </h3>
              <p className={styles.time}>1 min</p>
            </div>
            <p>
              The Generous Share App is built on top of another App that is
              called Expo. The first step is go to the Apple App or Android Play
              store and download <strong>“Expo Go”</strong>.
            </p>
            <p>
              Once you have downloaded the App, return to this page and proceed
              to Step 2.
            </p>
            <p>
              <a
                href="https://itunes.apple.com/app/apple-store/id982107779"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.button}
              >
                Install for iOS
              </a>{" "}
              <a
                href="https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.button}
              >
                Install for Android
              </a>
            </p>
            <div className={styles.stepHeaderWrapper}>
              <h3>Step 2: Launch Generous Share </h3>
              <p className={styles.time}>4 mins</p>
            </div>
            <p>
              Now you will need to launch Generous Share inside Expo. This part
              is a hella confusing, so we have provided screenshots below and
              instructions for you to follow. We're working on making it easier,
              but usurping the man is a hard task!
            </p>
            <p>
              A) Start your set up process using your unique button. You will
              find this at the end of these instructions.
            </p>
            <p>
              B) Expo will open and you will see the welcome screen for expo.
              Click OK.
            </p>
            <p>
              C) Now, you will see a Generous Share overlay. Just click the
              Close button (X) in the top corner of that overlay.
            </p>
            <p>
              D) That’s it! Follow the final prompts to complete set up. Then
              save your password and connect with friends who have sent you
              invitation codes.
            </p>
            <hr />
            <h4>Start set up process</h4>
            <p>
              This button is UNIQUE TO YOU. It will launch the Expo App. It
              includes your SECRET tokens. We recommend you DON’T SHARE IT!
            </p>
            <p className="buttonLinkP">
              <a
                href={`${url}?username=${username}&token=${token}${
                  typeof inviteCode === "string"
                    ? `&invitecode=${inviteCode}`
                    : ""
                }`}
              >
                Start {name}'s set up process
              </a>
            </p>
            <h2>
              Welcome to the <br />
              <span>Generous revolution.</span>
            </h2>
            <GotQuestions />
          </>
        )}
      </main>
      <footer className={styles.footer}>
        <p>v: {version}</p>
      </footer>
    </div>
  );
};

export default Home;
