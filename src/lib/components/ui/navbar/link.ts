import { t } from '$lib/translations'
import {
  UserCircle,
  type IconSource,
  Home,
  ChartBar,
  Cog6Tooth,
  Newspaper,
  GlobeAmericas,
  GlobeAlt,
  MagnifyingGlass,
  ShieldCheck,
  ServerStack,
  PencilSquare,
  MapPin,
} from 'svelte-hero-icons'
import { get } from 'svelte/store'

export interface Link {
  url: string
  label?: string
}

export const defaultLinks: Link[] = [
  {
    url: '/',
    label: t.get('nav.home'),
  },
  {
    url: '/?type=All',
    label: t.get('filter.location.all'),
  },
  {
    url: '/?type=Local',
    label: t.get('filter.location.local'),
  },
  {
    url: '/?type=Subscribed',
    label: t.get('filter.location.subscribed'),
  },
  {
    url: '/communities',
    label: t.get('nav.communities'),
  },
  {
    url: '/search',
    label: t.get('nav.search'),
  },
  {
    url: '/moderation',
    label: t.get('moderation.label'),
  },
  {
    url: '/admin',
    label: t.get('admin.label'),
  },
  {
    url: '/settings',
    label: t.get('nav.menu.settings'),
  },
  {
    url: '/create/post',
    label: t.get('form.post.create'),
  },
]

export const iconOfLink = (url: string): IconSource => {
  switch (url) {
    case '/':
      return Home
    case '/?type=All':
      return GlobeAmericas
    case '/?type=Subscribed':
      return Newspaper
    case '/?type=Local':
      return MapPin
    case '/communities':
      return GlobeAlt
    case '/search':
      return MagnifyingGlass
    case '/moderation':
      return ShieldCheck
    case '/admin':
      return ServerStack
    case '/settings':
      return Cog6Tooth
    case '/create/post':
      return PencilSquare
  }
}
