export const createConnectionInvite = async ({
  name,
  notes,
}: {
  name: string;
  notes: string;
}) => {
  // - Create the mine repo, including a new encryption key
  // - Push it, thus validating the remote URL
  // - Create a pull / read only key
  // - Package the remote URL, fetch auth, and encryption key into some kind of
  //   string that can be shared by a human
};

export const acceptConnectionInvite = async () => {
  // createConnectionInvite()
  // Unpack the string into remote, fetch auth, and encryption key
  // Clone encrypted the repo
};
