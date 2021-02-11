import { getInviteLink } from "../link/link.service";

export const getShareInviteMessage = ({
  inviteCode,
  senderName,
  recipientName,
}: {
  inviteCode: string;
  senderName?: string;
  recipientName: string;
}) => {
  const link = getInviteLink({
    inviteCode: inviteCode,
    recipientName,
    senderName,
  });

  return `Hey ${recipientName}! Here is your personal invitation code and link to connect with me on Generous Share.

Your invitation code is:
${inviteCode}

Your invitation link:
${link}

Generous is a guerilla app that is suveillance free and enables you to connect to your trusted network and share whatever you want. Built by humans in favour of a better humanity.`;
};
