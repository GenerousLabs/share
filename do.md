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
- [ ] Create connection flow
  - [ ] Generate an invite
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
- [ ] Kill the console.error() on key creation

## Low priority

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
