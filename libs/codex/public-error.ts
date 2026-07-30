export type PublicCodexErrorCode =
  | "CODEX_AUTH_REQUIRED"
  | "CODEX_NOT_AVAILABLE"
  | "CODEX_TIMEOUT"
  | "CODEX_CALL_FAILED";

export type PublicCodexError = {
  code: PublicCodexErrorCode;
  error: string;
  recovery: string;
  status: number;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function toPublicCodexError(error: unknown): PublicCodexError {
  const message = errorMessage(error);

  if (
    /not (logged in|authenticated)|authentication required|please log in|unauthorized|status 401|CODEX_AUTH_REQUIRED/i.test(
      message,
    )
  ) {
    return {
      code: "CODEX_AUTH_REQUIRED",
      error: "Your Codex session needs to be connected again.",
      recovery:
        "Run npm run codex:login in this project, complete the browser sign-in, then resend your response.",
      status: 401,
    };
  }

  if (/ENOENT|command not found|CODEX_NOT_AVAILABLE/i.test(message)) {
    return {
      code: "CODEX_NOT_AVAILABLE",
      error: "The local Codex CLI is not available.",
      recovery:
        "Run npm install in this project, restart the app, then try again.",
      status: 503,
    };
  }

  if (/timed out|timeout|CODEX_TIMEOUT/i.test(message)) {
    return {
      code: "CODEX_TIMEOUT",
      error: "Codex took too long to answer.",
      recovery: "Wait a moment, then resend your response.",
      status: 504,
    };
  }

  return {
    code: "CODEX_CALL_FAILED",
    error: "Codex could not answer this turn.",
    recovery:
      "Check the terminal running Motive for details, then resend your response.",
    status: 500,
  };
}
