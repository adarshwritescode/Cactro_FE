/**
 * A discriminated union rather than the `{ data, isLoading, error }` bag: only
 * the states that can actually occur are representable, and narrowing on
 * `status` hands consumers a non-optional `data` with no assertion needed.
 */
export type AsyncState<TData> =
  | { status: "loading" }
  | { status: "success"; data: TData }
  | { status: "error"; error: Error };

export function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error(String(cause));
}
