import { loadPosts } from '$lib/lemmy.ts'

export async function load({ url, fetch }) {
  return loadPosts(url, fetch);
}
