import type { HandleServerError } from '@sveltejs/kit'

export const handleError: HandleServerError = async ({
  error,
  event,
  status,
  message,
}) => {
  console.error(`An error was captured:`)
  console.error(error)
  console.error(`Event:`, event),
    console.error(`Status:`, status),
    console.error(`Message:`, message)
}
