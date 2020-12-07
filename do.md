- [x] Add logging infrastructure
  - Maybe winston? - nope, doesn't play well with react native
  - Prep to be able to show logs to the user in the UI
  - Save to a file maybe?
  - DECISION: Use react-native-logs, write custom file system adapter
    - Later: shard logs based on date or something
    - Reading & writing the whole file could get costly fast
    - Shard by day and then add a "reset all logs" function
- [ ] Add createdAt / updatedAt fields to Offers
- [ ] Sort offers by createdAt / updatedAt dates
- [ ] Write to and read from repos.yaml
  - As a fallback?
  - Write into the file after successfully importing and then it's only
    written to after successful initialisation
- [x] Do we redux-persist?
  - If so, we can potentially consider the redux state to be somewhat persistent
  - Could deploy a "regenerate state" function later
- [ ] Add function to grant user read-only (pull-only) access to a repo
  - Write into the commands repo
  - Need to define the format of the commands repo
- [ ] How do we package a
- [ ] Put real repos into the repo startup saga
- [ ] Define the format for a `me` repo
  - Add a type field to the repos list
- [x] Add tags to offers
- [ ] p2 Add server to host git repos
- [ ] p3 Add password key derivation to encryption

## Friends of friends

- [ ] Dedupe items by uuid
  - Maybe favour the proximity?

## Later

- [ ] Running setup on an existing repo will fail in odd ways see #1
- [ ] Implement deleteLogs() #rCOtsm
