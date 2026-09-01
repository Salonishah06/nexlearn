import 'server-only'

import {client} from './client'
import {readToken} from './token'

/**
 * The only Sanity client bound to the read token. Server-only — importing this
 * module from a Client Component fails the build via `server-only`.
 */
const serverClient = client.withConfig({token: readToken})

type QueryParams = Record<string, unknown>

interface SanityFetchOptions<QueryString extends string> {
  query: QueryString
  params?: QueryParams
  /**
   * Next.js cache tags for on-demand revalidation (e.g. from a webhook route).
   * Pass tags like `['course', 'course:my-slug']`.
   */
  tags?: string[]
  /** Seconds until the cached response goes stale. `false` caches indefinitely. */
  revalidate?: number | false
}

/**
 * Server-side read helper for all page data. Wraps the token-bound client with
 * Next.js caching (time-based by default, plus tag-based revalidation).
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  tags = [],
  revalidate = 3600,
}: SanityFetchOptions<QueryString>) {
  return serverClient.fetch(query, params, {
    next: {
      revalidate: revalidate === false ? false : revalidate,
      tags,
    },
  })
}
