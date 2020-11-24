# Share Server

The share mobile app works with git as its transport layer.

When I want to share "assets" of some kind, I create a git repository. This
repo is called a "library" because it contains a collection of "assets" that
I wish to share. Using git-remote-encrypted I push this repo to a server.
Then I give the key to the repo to friends of mine. They can pull the repo
from the server, and can decrypt its contents.

However, friends of mine cannot push changes to my library. I am the only
author with push rights.

Ideally, I would give each friend a unique auth token that grants them pull
access to my repository. Somehow, I need to give the server access to these
auth tokens. The server obviously needs access in plain text, and not in
encrypted form.

One idea is to create a so called "commands" repository. As a user, I can
push to my "commands" repository. This repo is not encrypted, so the server
can read its contents. The server will read the contents of the repo, and
interpret them as commands to execute.

Initially, the first command would be to allow pull access.

For example, the file layout on the server might look like:

- `/user` - A directory containing all the repos owned by 1 user
- `/user/me.enc.git` - A single "master" repository that the user controls,
  but the contents are encrypted, so the server can only see when pushes
  happen, but not what the contents of the repository are.
- `/user/library.enc.git` - A library of content, owned by 1 user, and shared
  with other users. This repo is encrypted.
- `/user/commands.git` - A repository containing "commands" that the user
  instructs the server to execute on their behalf. This repo is unencrypted
  on the server.
  - `/user/commands.git/auth.yaml` - A file containing access keys which are
    permitted to access specific repositories. The server can use this file
    to decide whether to accept or reject pull operations based on the tokens
    in this file.

In the future, we could also add extra commands like:

- `/user/commands.git/notifications.yaml` - A file containing the user's expo
  notification token, or Apple Push Notification Service identifier, or Google
  Push identifier, etc. Then a list of fetch details for repositories to be
  monitored, so that the user can receive a notification when there is new
  content. The server could be safely given the `pull` auth token (see above)
  and only know when new content had been pushed, but not what that content
  was.
