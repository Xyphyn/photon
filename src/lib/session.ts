interface SessionStorage {
  lastSeenCommunity: // prettier-ignore
  {
    id: number
    name: string
  } | undefined
  postData: {}
}

export const setSessionStorage = (
  key: keyof SessionStorage,
  value: SessionStorage[typeof key]
) => {
  if (value == undefined) {
    sessionStorage.removeItem(key)
  } else {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
}

export const getSessionStorage = (
  key: keyof SessionStorage
): SessionStorage[typeof key] => {
  return JSON.parse(sessionStorage.getItem(key)!)
}
