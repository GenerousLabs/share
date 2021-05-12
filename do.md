# Archiving

Add the option to archive content.

- What happens if somebody archives something that I have imported?
  - How do I even notice?
  - Do I automatically "archive" my copy?
  - What happens if they remove me as a connection? Same thing?
- What does "archiving" look like on a filesystem level?
  - `archived: true` added?

# Sprint 3

Let's start planning the next sprint properly.

Key focus candidates:

- Friends of friends
- Stability, error recovery, reliability
- Archiving content

Questions for foaf:

- [x] How do we track this in redux?
  - What about keeping the format as is and using a selector to find
    duplicated uuids, then somehow presenting them as a single unit to the user?
- [x] What about multiple friends sharing the same item with me?
  - How do we present this?
  - Some kind of change to the UI, but can be figured out later
- [x] Can I archive something that I imported?
  - Defer that until the archive stage...
- [x] How do I see what items are available for me to "import"?
  - Add an icon to lists in Browse

# Scratchpad

- [ ] The Home button leaves stack navigators in a weird state
  - Maybe we want to add a `goBack()` action beforehand?
  - Or add some "go home" action to the `Header` component?
- [ ] After successful submission go back to the list view
  - Add an offer, anywhere else? Friends maybe?
- [x] Browser links with variables don't work on iOS
- [x] Add a reload button to refetch
- [ ] Workflow to add users to the server and create the links
- [x] The commands repo is not being pushed
- [x] Long names without spaces break the website on mobile
- [x] When clicking "accept invite", there's no action visible in the app
  - Also it lacks the name of the person
- [x] The code doesn't clear after accepting an invite
- [x] Going to Accept Invite leads to a "Connected" screen
  - No back option, no chance to escape this view
- [x] There's a URL encoding issue in the link generation
  - Emojis don't work, spaces in names cause issues

# Sprint 2

Get this in the hands of users. Preferrably on both platforms, but Android
only would be possible.

- [x] Get iOS running
- [x] Implement a postoffice
  - Where do we store boxIds on the client?
  - [x] Watch for replies
  - [x] Add libraries to shares
- [x] Catch startup errors and show them to the user
  - Currently it fails silently, which is ugly
- [x] Update git-encrypted in expo
  - URLs are now self contained, no keys required
  - Change invite codes, INVITE_base64encodedURL ?
  - Ignore the codes and use the postoffice?
    - Fall back to actual URLs? - Advanced use case anyway
- [x] Remove the Settings view
  - Put it behind triple tapping the logo or something
- [x] Make a plan on deletion, correcting errors, etc
  - What about a "tech view" screen?
- [x] Post offers and requests
  - Waiting for design confirmation on how / where this happens
  - Define format on disk
- [x] Round of UI polishing
- [x] Check deep linking in exp://
- [x] Change settings top right to help / home link
  - Also add note to homepage that it is top right
- [x] Explore markdown in ReactNative
- [x] Switch postoffice codes to \_ separator
- [x] Leave only the header sticky, the rest scrolls
- [x] Change Johannes to the user's actual name in the web site!
- [x] Host our own build
  - Android requests `/assets/xxx` instead of `/app/assets/xxx`
  - Maybe move it to the root?
  - Folders are only `assets` and `bundles`, plus the `platform-index.json`

## Closing stage

- [x] Create a basic web page
- Web links
  - [x] Create the web page
  - [x] Capture the links
    - How to start the setup?
    - Redirect to the connection accept form prefilled?
    - Yes, redirect to setup, add name field
- [x] Add text to invite link
- [x] Check repo names to make sure they're not empty
  - Causes a bug in saving / reading from repos.yaml
  - Where do we save name?
- [x] Add home / help page intro section
  - Were you invited? Try clicking the link again...
  - Click here to accept your invitation
- [x] Add password section to home / help page
- [x] Build script including website and expo
- [x] Add name (senderName) to link service when generating invite links
- [ ] Markdown update on homepage
  - Pull via a web request? - later
- [x] Check exps:// links without app launch
  - Works on Android
  - [ ] Check iOS

## Sven

- [x] Only allow each postoffice code to be used once
- [x] Save postoffice reply to redux, retry http request if it fails

## Sprint 2 Follow ups

- [x] Add a postoffice history
  - Redux
  - Save all operations so they can be retried if they fail
- [x] Use `os-index.json` in the URL
  - Stop messing around with the redirects and so on, it doesn't work
- [ ] Delete a connection
  - How do they know we deleted our repo?
  - Return a 410 gone instead of the usual git nonsense
    - Keep the access token and use it to trigger a 410?
- [ ] Retry on failure
  - Lots of things can go wrong, can we retry them?
  - Maybe a "refetch" type action that runs all the git pull commands again?
- [ ] Decide on a "refetch" strategy
  - Read from disk and rebuild redux state

## Sprint 2 Nice to Have

- [ ] base64 encode names in share URLs?
- [x] Simplify / cleanup setup screen
- [x] Investigate the `lirary/loadOffer/ERROR` actions
- [ ] Investigate all `yield dispatch()` or `yield putResolve()` calls
  - They will bubble errors, which potentially breaks the sagas
  - I'm mostly using them to await, but I might not want them to throw
- [ ] Gracefully handle postoffice failures
  - See TODO21 in the codebase
  - If the server returns a 404, we currenty log it as an error
  - Maybe we need to return an enum to handle expected failures
- [ ] Handle failure of postoffice server
- [ ] Refactor all sagas
  - All sagas are named exports (no more default export)
  - All sagas refactored to use the `createAsyncPromiseSaga()` helper
- [ ] Block navigation during form submission #next
  - The user shouldn't be able to go back out of the current view, even with
    the side slider action in iOS or the back button in Android
- [ ] Create a build time config #next
  - [ ] Move postoffice URL into build config

# Sprint 1

- [x] From a list -> another page
  - Is it a navigator? A stack? A side stack?
  - Better not to use singe components
  - Or, top leve screen scenes need to just load children
  - Stack navigator, it has right / bottom on ios / android
  - Top level menu
- [x] Browse & Your Stuff UI
- [x] Some way to share a library
- [x] Load offers from the imported library
  - And probably our own
- [x] Report back to action promises lib
- [x] Repull subscribed to libraries somehow
- [x] Fix encrypted pull
  - It creates the objects but doesn't update the branch or check out the changes
- [x] Convert createNewOfferSagaAction to a promise action
  - OfferForm doesn't finish submitting
- [x] Add friends / friends-of-friends to OfferForm
- [x] Add tags to OfferForm
  - Comma separated? That might do for now, can improve it

# Next

- [x] Why do I need to double press some buttons?
- [ ] Remove parentLogger stuff, extend from rootLogger every time
- [ ] Validate action shape in sagas
  - I introduced a bug where two actions had the same name
  - Various functions were invoked with the wrong params because the code
    assumes, TypeScript believes, that this will never happen
  - Could use zod to validate the actions as a safe guard
  - Hmm, testing, or in production? Either way, later...
- [x] Add logging infrastructure
  - Maybe winston? - nope, doesn't play well with react native
  - Prep to be able to show logs to the user in the UI
  - Save to a file maybe?
  - DECISION: Use react-native-logs, write custom file system adapter
    - Later: shard logs based on date or something
    - Reading & writing the whole file could get costly fast
    - Shard by day and then add a "reset all logs" function
- [x] Add createdAt / updatedAt fields to Offers
- [x] Write to and read from repos.yaml
  - As a fallback?
  - Write into the file after successfully importing and then it's only
    written to after successful initialisation
  - When do we read from this? Only on re-setup I guess, which is later.
- [x] Do we redux-persist?
  - If so, we can potentially consider the redux state to be somewhat persistent
  - Could deploy a "regenerate state" function later
- [x] Add function to grant user read-only (pull-only) access to a repo
  - Write into the commands repo
  - Need to define the format of the commands repo
- [x] Put real repos into the repo startup saga
- [x] Define the format for a `me` repo
  - Add a type field to the repos list
- [x] Add tags to offers
- [x] How do we package the code url + keys?
- [x] Create connection flow
  - [x] Generate an invite
    - Create a connection repo
    - Grant access
  - [x] Accept an invite
    - Import the repo
    - Create a repo
    - Post a ping message
    - Grant access
  - [x] Confirm connection
    - Import the repo
    - Read the ping message
    - Post a pong message
  - Put a connections.yaml file in the me repo
    - Array of objects, one per connection
- [x] Kill the console.error() on key creation

## Low priority

- [x] Pass name from connection / subscription through to redux
  - Currently it's silently dropped in `_createNewRepo()`
- [ ] Refactor creating repos into a saga
  - Right now it's a function that returns a RepoInRedux
  - It should be a saga that pushes to redux on its own
- [x] p2 Add server to host git repos
- [x] p3 Add password key derivation to encryption
- [x] Move reposYaml to be a sub service of repos
  - I don't need to access it directly
- [ ] Implement the load repo from filesystem
  - In theory can be done later

## Friends of friends

- [x] Dedupe items by uuid
  - Maybe favour the proximity?

## Later

- [ ] Implement setup from an existing me repo
- [ ] Running setup on an existing repo will fail in odd ways see #1
- [ ] Implement `deleteLogs()` #rCOtsm
