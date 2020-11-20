import invariant from "tiny-invariant";

export const invariantSelector = <T extends (...args: any[]) => any>(
  fn: T,
  message: string
) => (...args: any[]) => {
  const result = fn(...args);
  invariant(result, message);
  return result as NonNullable<ReturnType<T>>;
};
