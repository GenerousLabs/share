export const isNonFastForwardError = (error: any) =>
  error.code === "PushRejectedError" &&
  error.data.reason === "not-fast-forward";
