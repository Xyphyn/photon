import type { Profile } from '$lib/auth'
import { resumables, type ResumableItem } from '$lib/lemmy/item'
import { t } from '$lib/translations'
import { fullCommunityName } from '$lib/util'
import {
  ArrowRightOnRectangle,
  Bookmark,
  Cog6Tooth,
  GlobeAlt,
  Home,
  Identification,
  Inbox,
  Newspaper,
  PencilSquare,
  UserCircle,
  UserGroup,
} from 'svelte-hero-icons'

export function getGroups(resumables: ResumableItem[], profile: Profile) {
  return [
    {
      name: t.get('nav.commands.recents'),
      actions: resumables.map((r) => ({
        name: r.name,
        icon: r.avatar ?? PencilSquare,
        href: r.url,
      })),
    },
    {
      name: t.get('nav.commands.main'),
      actions: [
        { href: '/', name: t.get('nav.home'), icon: Home, shortcut: 'h' },
        {
          href: '/communities',
          name: t.get('nav.communities'),
          icon: GlobeAlt,
        },
      ],
    },
    {
      name: t.get('profile.profile'),
      actions: profile.jwt
        ? [
            {
              href: '/profile/user',
              name: t.get('profile.profile'),
              icon: UserCircle,
            },
            {
              href: '/inbox',
              name: t.get('profile.inbox'),
              icon: Inbox,
              shortcut: 'i',
            },
            {
              href: '/saved',
              name: t.get('profile.saved'),
              icon: Bookmark,
            },
            {
              href: '/accounts',
              name: t.get('account.accounts'),
              icon: UserGroup,
            },
          ]
        : [
            {
              href: '/login',
              name: t.get('account.login'),
              icon: ArrowRightOnRectangle,
            },
            {
              href: '/signup',
              name: t.get('account.signup'),
              icon: Identification,
            },
            {
              href: '/accounts',
              name: t.get('account.accounts'),
              icon: UserGroup,
            },
          ],
    },
    {
      name: t.get('nav.menu.app'),
      actions: [
        {
          href: '/settings',
          name: t.get('nav.menu.settings'),
          icon: Cog6Tooth,
        },
      ],
    },
    {
      name: t.get('nav.commands.content'),
      actions: [
        {
          href: '/create/post',
          name: t.get('routes.createPost'),
          icon: PencilSquare,
        },
        {
          href: '/create/community',
          name: t.get('routes.createCommunity'),
          icon: Newspaper,
        },
      ],
    },
    {
      name: t.get('profile.subscribed'),
      actions:
        profile?.user?.follows.map((f) => ({
          icon: f.community.icon,
          name: f.community.title,
          href: `/c/${fullCommunityName(
            f.community.name,
            f.community.actor_id
          )}`,
        })) ?? [],
    },
  ]
}
