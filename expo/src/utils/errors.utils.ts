import { createAction } from "@reduxjs/toolkit";

export type SerializableError = {
  code?: string;
  data?: any;
  message: string;
};

export const getSerializableError = (error: Error): SerializableError => {
  const { message } = error;
  const code =
    typeof (error as any).code === "string" ? (error as any).code : undefined;
  const data =
    typeof (error as any).data !== "undefined"
      ? (error as any).data
      : undefined;
  return { message, code, data };
};

export const makeErrorActionCreator = (baseActionType: string) => {
  return createAction(
    baseActionType + "/ERROR",
    ({
      error,
      message,
      meta,
    }: {
      error?: Error;
      message: string;
      meta?: {};
    }) => {
      const cleanError =
        typeof error === "undefined" ? undefined : getSerializableError(error);
      return {
        payload: { error: cleanError, message, meta },
      };
    }
  );
};
