import { fullCommunityName } from "$lib/util";
import type { Community, Person } from "lemmy-js-client";

export const communityLink = (community: Community, prefix: string = '') =>
  `${prefix}/c/${fullCommunityName(community.name, community.actor_id)}`

export const userLink = (person: Person, prefix: string = '') =>
  `${prefix}/c/${person.name}@${new URL(person.actor_id).hostname}`