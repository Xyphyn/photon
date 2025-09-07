import * as lemmy from 'lemmy-js-client'
import type { GetPosts, ListingType } from '../types'

export function fromGetPosts(getPosts: GetPosts): lemmy.GetPosts {
  return {
    ...getPosts,
    type_: getPosts.type_ == 'Popular' ? 'All' : getPosts.type_,
  }
}

export function toListingType(
  listingType?: ListingType,
): lemmy.ListingType | undefined {
  if (listingType == 'Popular') listingType = 'All'
  return listingType
}
