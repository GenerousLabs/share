declare module "@chmac/node-git-server" {
  type EventName =
    // | 'close'
    // | 'data'
    // | 'drain'
    // | 'end'
    // | 'error'
    "fetch" | "head" | "info" | "push" | "tag";

  class HttpDuplex {}

  class Service {
    accept: () => void;
    reject: () => void;
  }

  class ServiceWithRepo extends Service {
    repo: string;
  }

  class Fetch extends ServiceWithRepo {
    commit: string;
  }

  class Push extends Fetch {
    branch: string;
  }

  class Tag extends Fetch {
    version: string;
  }

  class Server {
    constructor(
      path: string,
      opts?: {
        /**
         * If provided, this path will be supplied to the git init command as --t
         */
        repoTemplatePath?: string;
        autoCreate?: boolean;
        /**
         * If authenticate() returns a promise, it will be awaited. If not, the
         * `next()` callback should be invoked without an `error` to signal
         * success, or with an `error` to signal failure.
         */
        authenticate?: (
          params: {
            type: "fetch" | "push" | "unknown";
            repo: string;
            /**
             * NOTE: Invoking the `user()` function will cause any requests
             * without a Basic authentication header to return a 401. This
             * triggers git to request a username / password from the user.
             */
            user: (
              callback: (
                username: string,
                password: string,
                error: null
              ) => void
            ) => void;
            headers: { [x: string]: string };
          },
          next: (error?: Error) => void
        ) => Promise<void> | void;
        /**
         * If `opts.checkout` is true, create and expected checked-out repos instead of bare repos
         */
        checkout?: boolean;
      }
    );
    // TODO: Better typing of `action` here
    on(event: EventName, callback: (service: Service) => void): void;
    on(event: "fetch", callback: (fetch: Fetch) => void): void;
    on(event: "push", callback: (push: Push) => void): void;
    on(event: "tag", callback: (tag: Tag) => void): void;
    list(callback: (err: Error, results: string[]) => void): void;
    listen(port: number, callback?: () => void): void;
    listen(
      port: number,
      options: {
        enableCors?: boolean;
        type?: "http" | "https";
        key?: Buffer | string;
        cert?: Buffer | string;
      },
      callback?: () => void
    ): void;
  }
  export default Server;
}
