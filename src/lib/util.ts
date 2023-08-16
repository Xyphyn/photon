import { goto } from '$app/navigation'
import { userSettings } from '$lib/settings.js'
import { get } from 'svelte/store'

export const findClosestNumber = (numbers: number[], target: number): number =>
  numbers.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  )

export const searchParam = (
  url: URL,
  key: string,
  value: string,
  ...deleteKeys: string[]
) => {
  url.searchParams.set(key, value)
  deleteKeys.forEach((k) => url.searchParams.delete(k))
  goto(url, {
    invalidateAll: true,
  })
}

export const fullCommunityName = (name: string, actorId: string) =>
  `${name}@${new URL(actorId).hostname}`

export const placeholders = {
  url: ['https://notas.cam', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
  post: [
    'Is starting nuclear warfare illegal?',
    'A cool photo I took before the destruction of mankind!',
    'AITA for ending all contention and causing world peace?',
    'BREAKING NEWS: Police break into gun shop, find weapons',
    'How do I make sure my pet rock stays alive?',
    'My cat just invented a time machine, what do I do?',
    'Unpopular opinion: world peace and global happiness would be beneficial to humanity',
    'LPT: The smaller weights are easier to lift than the bigger weights in a gym',
    'javascript bad',
    'ELI5: What is 4 + 8?',
  ],
  comment: [
    'aint no way',
    'new response just dropped',
    '<insert funny joke here>',
    'say, why did we name restaurant staff after computers, anyway?',
    `this.\nedit: thanks for 1 upvote😃😃😃!`,
    'Officer, I drop kicked that child in self defense! You gotta believe me man.',
    'this comment placeholder is very important dont forget',
    'As Abraham Lincoln once said, "don\'t believe everything you see on the internet."',
    'existential crisis in progress',
  ],
  get: (type: 'url' | 'post' | 'comment') => {
    return get(userSettings)?.randomPlaceholders
      ? placeholders[type][
          Math.floor(Math.random() * placeholders[type].length)
        ]
      : ''
  },
}
