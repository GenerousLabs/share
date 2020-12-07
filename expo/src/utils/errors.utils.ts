import { ActionCreator, AnyAction, createAction } from "@reduxjs/toolkit";

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

export const makeErrorActionCreator = (
  baseActionType: string | ActionCreator<AnyAction>
) => {
  return createAction(
    baseActionType + "/ERROR",
    ({
      error,
      message,
      isFatal = false,
      meta,
    }: {
      error?: Error;
      message: string;
      isFatal?: boolean;
      meta?: {};
    }) => {
      const cleanError =
        typeof error === "undefined" ? undefined : getSerializableError(error);
      return {
        payload: { error: cleanError, message, meta },
        meta: { isFatal },
      };
    }
  );
};
