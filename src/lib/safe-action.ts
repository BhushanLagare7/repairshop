import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError(e, utils) {
    const { clientInput, metadata } = utils;
    Sentry.captureException(e, (scope) => {
      scope.clear();
      scope.setContext("serverError", { message: e.message });
      scope.setContext("metadata", { actionName: metadata.actionName });
      scope.setContext("clientInput", { clientInput });

      return scope;
    });

    // Check for database errors (DrizzleQueryError wraps the real error in `cause`)
    if (
      e.constructor.name === "DatabaseError" ||
      e.constructor.name === "DrizzleQueryError"
    ) {
      // Extract the real PostgreSQL error from the cause chain
      const cause = (e as Error & { cause?: Error & { detail?: string } })
        .cause;
      if (cause?.detail) {
        // Show user-friendly message for constraint violations
        return `Database error: ${cause.detail}`;
      }
      return "Database error: Your data did not save. Support team has been notified.";
    }

    return e.message;
  },
});
