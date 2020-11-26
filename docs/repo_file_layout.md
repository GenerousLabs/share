# Repo File Layout

This whole application is structured as a series of linked git repositories.

I want to share things with friends. I create a repo. Into that repo I put
markdown files that describe the things I'm sharing. Then I share pull access
to that repo with a friend. The friend can pull the repo, decrypt it, and see
what I'm offering to share.

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
