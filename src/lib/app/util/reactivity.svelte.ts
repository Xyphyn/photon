export const proxify = <T>(data: T) => {
  const res = $state(data)
  return res
}
