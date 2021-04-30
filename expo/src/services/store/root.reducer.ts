import { combineReducers } from "@reduxjs/toolkit";
import connection, {
  REDUCER_KEY as connectionKey,
} from "../connection/connection.state";
import library, { REDUCER_KEY as libraryKey } from "../library/library.state";
import postoffice, {
  REDUCER_KEY as postofficeKey,
} from "../postoffice/postoffice.state";
import repo, { REDUCER_KEY as repoKey } from "../repo/repo.state";
import setup, { REDUCER_KEY as setupKey } from "../setup/setup.state";
import startup, { REDUCER_KEY as startupKey } from "../startup/startup.state";

const reducer = combineReducers({
  [connectionKey]: connection,
  [libraryKey]: library,
  [postofficeKey]: postoffice,
  [repoKey]: repo,
  [setupKey]: setup,
  [startupKey]: startup,
});

export default reducer;
