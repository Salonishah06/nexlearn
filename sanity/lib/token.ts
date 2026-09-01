import 'server-only'

/**
 * Server-only Sanity read token for the private dataset.
 * Never expose to the browser, never prefix with NEXT_PUBLIC_.
 */
export const readToken = assertValue(
  process.env.SANITY_API_READ_TOKEN,
  'Missing environment variable: SANITY_API_READ_TOKEN',
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}
