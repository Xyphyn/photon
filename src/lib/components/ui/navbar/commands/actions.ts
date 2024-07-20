import type { Profile } from '$lib/auth'
import {
  amModOfAny,
  isAdmin,
} from '$lib/components/lemmy/moderation/moderation'
import { resumables, type ResumableItem } from '$lib/lemmy/item'
import { userSettings } from '$lib/settings'
import { t } from '$lib/translations'
import { legacyTheme } from '$lib/ui/colors'
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
  ServerStack,
  ShieldCheck,
  UserCircle,
  UserGroup,
  ViewColumns,
  type IconSource,
  PaintBrush,
  ComputerDesktop,
  Sun,
  Moon,
  MapPin,
  GlobeAmericas,
  ChartBar,
  Trophy,
  ArrowTrendingUp,
  Fire,
  Scale,
  Star,
  Clock,
  ArrowTrendingDown,
  ChatBubbleOvalLeftEllipsis,
  ChatBubbleLeftRight,
} from 'svelte-hero-icons'

export interface Group {
  name: string
  actions: Action[]
}

export interface Action {
  name: string
  desc?: string
  handle?: () => any
  href?: string
  shortcut?: string
  icon: string | IconSource
  subActions?: Action[]
}

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
        ...(amModOfAny(profile.user)
          ? [
              {
                href: '/moderation',
                name: t.get('nav.moderation'),
                icon: ShieldCheck,
              },
            ]
          : []),
        ...(profile.user && isAdmin(profile.user)
          ? [
              {
                href: '/admin',
                name: t.get('nav.admin'),
                icon: ServerStack,
              },
            ]
          : []),
      ],
    },
    {
      name: t.get('nav.commands.feeds'),
      actions: [
        {
          name: t.get('filter.location.label'),
          icon: GlobeAmericas,
          subActions: [
            {
              name: t.get('filter.location.all'),
              icon: GlobeAmericas,
              href: '/?type=All',
            },
            {
              name: t.get('filter.location.local'),
              icon: MapPin,
              href: '/?type=Local',
            },
            {
              name: t.get('filter.location.subscribed'),
              icon: Newspaper,
              href: '/?type=Subscribed',
            },
          ],
        },
        {
          name: t.get('filter.sort.label'),
          icon: ChartBar,
          subActions: [
            {
              name: t.get('filter.sort.top.label'),
              icon: Trophy,
              subActions: [
                {
                  name: t.get('filter.sort.top.time.all'),
                  icon: ChartBar,
                  href: '/?sort=TopAll',
                },
                {
                  name: t.get('filter.sort.top.time.9months'),
                  icon: ChartBar,
                  href: '/?sort=Top9Months',
                },
                {
                  name: t.get('filter.sort.top.time.6months'),
                  icon: ChartBar,
                  href: '/?sort=Top6Months',
                },
                {
                  name: t.get('filter.sort.top.time.3months'),
                  icon: ChartBar,
                  href: '/?sort=Top3Months',
                },
                {
                  name: t.get('filter.sort.top.time.month'),
                  icon: ChartBar,
                  href: '/?sort=TopMonth',
                },
                {
                  name: t.get('filter.sort.top.time.week'),
                  icon: ChartBar,
                  href: '/?sort=TopWeek',
                },
                {
                  name: t.get('filter.sort.top.time.day'),
                  icon: ChartBar,
                  href: '/?sort=TopDay',
                },
                {
                  name: t.get('filter.sort.top.time.6hours'),
                  icon: ChartBar,
                  href: '/?sort=Top6Hours',
                },
                {
                  name: t.get('filter.sort.top.time.hour'),
                  icon: ChartBar,
                  href: '/?sort=TopHour',
                },
              ],
            },
            {
              name: t.get('filter.sort.active'),
              icon: ArrowTrendingUp,
              href: '/?sort=Active',
            },
            {
              name: t.get('filter.sort.hot'),
              icon: Fire,
              href: '/?sort=Hot',
            },
            {
              name: t.get('filter.sort.scaled'),
              icon: Scale,
              href: '/?sort=Scaled',
            },
            {
              name: t.get('filter.sort.new'),
              icon: Star,
              href: '/?sort=New',
            },
            {
              name: t.get('filter.sort.old'),
              icon: Clock,
              href: '/?sort=Old',
            },
            {
              name: t.get('filter.sort.controversial'),
              icon: ArrowTrendingDown,
              href: '/?sort=Controversial',
            },
            {
              name: t.get('filter.sort.mostcomments'),
              icon: ChatBubbleOvalLeftEllipsis,
              href: '/?sort=MostComments',
            },
            {
              name: t.get('filter.sort.newcomments'),
              icon: ChatBubbleLeftRight,
              href: '/?sort=NewComments',
            },
          ],
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
        {
          name: t.get('nav.commands.setView'),
          icon: ViewColumns,
          subActions: [
            {
              name: t.get('nav.commands.setViewTo', {
                default: t.get('filter.view.compact'),
              }),
              icon: ViewColumns,
              handle: () =>
                userSettings.update((s) => ({
                  ...s,
                  view: 'compact',
                })),
            },
            {
              name: t.get('nav.commands.setViewTo', {
                default: t.get('filter.view.cozy'),
              }),
              icon: ViewColumns,
              handle: () =>
                userSettings.update((s) => ({
                  ...s,
                  view: 'cozy',
                })),
            },
            {
              name: t.get('nav.commands.setViewTo', {
                default: t.get('filter.view.list'),
              }),
              icon: ViewColumns,
              handle: () =>
                userSettings.update((s) => ({
                  ...s,
                  view: 'list',
                })),
            },
            {
              name: t.get('nav.commands.setViewTo', {
                default: t.get('filter.view.legacy'),
              }),
              icon: ViewColumns,
              handle: () =>
                userSettings.update((s) => ({
                  ...s,
                  view: 'card',
                })),
            },
          ],
        },
        {
          name: t.get('nav.commands.setColor'),
          icon: PaintBrush,
          subActions: [
            {
              name: t.get('nav.commands.setColorTo', {
                default: t.get('nav.menu.colorscheme.system'),
              }),
              handle: () => legacyTheme.set('system'),
              icon: ComputerDesktop,
            },
            {
              name: t.get('nav.commands.setColorTo', {
                default: t.get('nav.menu.colorscheme.light'),
              }),
              handle: () => legacyTheme.set('light'),
              icon: Sun,
            },
            {
              name: t.get('nav.commands.setColorTo', {
                default: t.get('nav.menu.colorscheme.dark'),
              }),
              handle: () => legacyTheme.set('dark'),
              icon: Moon,
            },
          ],
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
