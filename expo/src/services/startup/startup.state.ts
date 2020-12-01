import { createAction } from "@reduxjs/toolkit";

/**
 * This action gets dispatched on application boot.
 */
export const maybeStartupAction = createAction("SHARE/maybeStartup");

/**
 * This action gets dispatched once the application is ready to boot.
 */
export const startupAction = createAction("SHARE/startup");
