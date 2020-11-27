# Repo File Layout

This whole application is structured as a series of linked git repositories.

I want to share things with friends. I create a repo. Into that repo I put
markdown files that describe the things I'm sharing. Then I share pull access
to that repo with a friend. The friend can pull the repo, decrypt it, and see
what I'm offering to share.

## Repo folder layout

- `/repos/` - A top level folder where repos live
- `/repos/me/` - The me repo, described below
- `/repos/control/` - A special repo that I use to send control messages to
  my host server
- `/repos/mine/` - A root folder for all of **my** repos
- `/repos/mine/example-library/` - A single repo of mine (a library)
- `/repos/connections/` - A root folder for my connection channels
- `/repos/connections/bob/` - A root folder containing all of my (Alice)
  connections with Bob
- `/repos/connections/bob/mine/` - My (Alice) side of the connection channel
  with Bob
- `/repos/connections/bob/theirs/` - Their (Bob's) side of the connection
  channel with Bob
- `/repos/connections/bob/bobs-digital-plans/` - A repo (library) that Bob
  has shared with me (Alice)
- `/repos/following/bobs-digital-plans/` - A repo (library) that Bob has
  shared with me (Alice)

## me repo

My settings, links to other repos (git urls and encryption keys), and various
other config type stuff lives in a "me" repo. To recover my account I need to
get access to my "me" repo and from that I should be able to reconstruct my
content. It's the "starting point", "entry point" or "index file"
conceptually speaking.

- `/config.yaml` - Some core config values
  - This is a leftover from the plans layout, unclear what we'll really store
    here in share
- `/repos.yaml` - Information on the other repos I have access to
  - Some of these are mine, some were shared by friends
- `/following.yaml` - Details on repos which are shared with me that I'm
  following (reading).
