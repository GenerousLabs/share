import { CONFIG } from "../../shared.constants";

const WEBSITE_URL = CONFIG.websiteUrl;

export const getInviteLink = ({
  inviteCode,
  recipientName,
  senderName,
}: {
  inviteCode: string;
  recipientName: string;
  senderName?: string;
}) => {
  const senderSegment =
    typeof senderName === "string" && senderName.length > 0
      ? `/${senderName}`
      : "";

  return `${WEBSITE_URL}/#/invite/${inviteCode}/${recipientName}${senderSegment}`;
};
