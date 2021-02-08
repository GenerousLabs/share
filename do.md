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
- [ ] Make a plan on deletion, correcting errors, etc
  - What about a "tech view" screen?
- [x] Post offers and requests
  - Waiting for design confirmation on how / where this happens
  - Define format on disk
- [x] Round of UI polishing
- [x] Check deep linking in exp://
- [ ] Change settings top right to help / home link
  - Also add note to homepage that it is top right
- [ ] Add text to invite link
- [x] Explore markdown in ReactNative
- [ ] Create a basic web page
- [ ] Web links
  - [x] Create the web page
  - [ ] Capture the links
- [x] Switch postoffice codes to \_ separator

## Sprint 2 Nice to Have

- [ ] Simplify / cleanup setup screen
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
- [ ] Block navigation during form submission
- [ ] Create a build time config
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
- [ ] Add tags to OfferForm
  - Comma separated? That might do for now, can improve it

# Next

- [ ] Why do I need to double press some buttons?
- [ ] Remvoe parentLogger stuff, extend from rootLogger every time
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
  - [ ] Accept an invite
    - Import the repo
    - Create a repo
    - Post a ping message
    - Grant access
  - [ ] Confirm connection
    - Import the repo
    - Read the ping message
    - Post a pong message
  - Put a connections.yaml file in the me repo
    - Array of objects, one per connection
- [ ] Kill the console.error() on key creation

## Low priority

- [ ] Pass name from connection / subscription through to redux
  - Currently it's silently dropped in `_createNewRepo()`
- [ ] Refactor creating repos into a saga
  - Right now it's a function that returns a RepoInRedux
  - It should be a saga that pushes to redux on its own
- [ ] p2 Add server to host git repos
- [ ] p3 Add password key derivation to encryption
- [ ] Move reposYaml to be a sub service of repos
  - I don't need to access it directly
- [ ] Implement the load repo from filesystem
  - In theory can be done later

## Friends of friends

- [ ] Dedupe items by uuid
  - Maybe favour the proximity?

## Later

- [ ] Implement setup from an existing me repo
- [ ] Running setup on an existing repo will fail in odd ways see #1
- [ ] Implement deleteLogs() #rCOtsm
