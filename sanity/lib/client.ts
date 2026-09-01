import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

/**
 * Token-less base client — safe to import from shared code.
 * The dataset is private, so any real read goes through `sanityFetch`
 * (sanity/lib/fetch.ts), which attaches the server-only read token.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // private dataset + tag-based revalidation
  perspective: 'published',
  stega: false,
})
