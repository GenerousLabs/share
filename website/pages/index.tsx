import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [invite, setInvite] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/token/")) {
      const [, , token, username] = hash.split("/");
      setToken(token);
      setUsername(username);
    } else if (hash.startsWith("#/invite/")) {
      const [, , invite, username] = hash.split("/");
      setInvite(invite);
      setUsername(username);
    }
    setIsBooting(false);
  }, []);

  if (isBooting) {
    return null;
  }

  return (
    <div className={styles.Wrapper}>
      <Head>
        <title>Generous Share</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.App}>
        <h1>Generous Share</h1>
        {invite === "" ? null : (
          <>
            <p>Hey {username}, welcome to the revolution.</p>
            <p>
              Johannes has invited you to join the Generous Share revolution.
            </p>
            <p>
              Do you already have the Generous Share app installed and setup?
            </p>
            <p>
              <button
                onSubmit={() => {
                  setIsExistingUser(true);
                }}
              >
                Yes
              </button>{" "}
              <button
                onSubmit={() => {
                  setIsExistingUser(false);
                }}
              >
                No
              </button>
            </p>
            <p>
              Yes? - AWESOME,{" "}
              <a href="exp://expo.host/generouslabs/share?invitecode=">
                click here to connect with Johannes
              </a>
            </p>
            <p>No? - No worries, we'll be happy to help you get setup.</p>
            <p>
              The process is a little convoluted. Unfortunately this kind of
              revolutionary software requires a little work.
            </p>
            <p>
              To get started, join the{" "}
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                Generous telegram group
              </a>
              . Post a message and say "I want an account with username xxx".
              Choose whatever username you like, we'll let you know if it's not
              available.
            </p>
            <p>
              Somebody will create an account for you and send you an
              installation link. It's a manual process, so unfortunately you
              might need to wait a day or two.
            </p>
          </>
        )}
        {token === "" ? null : (
          <>
            <p>Hey {username}, welcome to the revolution.</p>
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
              >
                Install for iOS
              </a>{" "}
              -{" "}
              <a
                href="https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install for Android
              </a>
            </p>
            <p>
              After you've installed Expo Go, come back to this page, and then
              you're ready to launch Generous Share inside Expo Go. Confused?
              Sorry, we're working on making it easier, but usurping the man is
              a hard task! You can always come back to this page, it's tailored
              just for you {username}.
            </p>
            <p>
              <a href="exp://exp.dev/generouslabs/share?username=foo&token=bar&invitecode=baz">
                Launch {username}'s Generous Share app (inside Expo Go)
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
