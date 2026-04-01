import type { Comment, CommentView, Post } from '$lib/api/types'
import { t } from '$lib/app/i18n'
import { settings } from '$lib/app/settings.svelte'
import { SvelteMap } from 'svelte/reactivity'

export interface CommentNodeI {
  comment_view: CommentView
  children: Array<CommentNodeI>
  depth: number
  loading?: boolean
  expanded?: boolean
}

function getCommentParentId(comment?: Comment): number | undefined {
  const split = comment?.path.split('.')
  // remove the 0
  split?.shift()

  return split && split.length > 1
    ? Number(split.at(split.length - 2))
    : undefined
}

function getDepthFromComment(comment?: Comment): number | undefined {
  const len = comment?.path.split('.').length
  return len ? len - 2 : undefined
}

export function buildCommentsTree(
  comments: CommentView[],
  baseDepth: number = 0,
  filter: (c: CommentView) => boolean = () => true,
): CommentNodeI[] {
  const map = new SvelteMap<number, CommentNodeI>()

  let min_depth = Number.MAX_VALUE
  for (const comment_view of comments) {
    const depthI = getDepthFromComment(comment_view.comment) ?? 0
    const depth = depthI + baseDepth
    if (comment_view.comment.content == '' && comment_view.comment.removed) {
      comment_view.comment.content = `*Removed by Moderator — [${t.get('routes.modlog.title')}](/modlog?comment=${comment_view.comment.id})*`
    }
    const node: CommentNodeI = {
      comment_view,
      children: [],
      depth: depth,
      expanded: true,
    }
    min_depth = Math.min(min_depth, depth)
    if (filter(comment_view)) {
      map.set(comment_view.comment.id, { ...node })
    }
  }

  const tree: CommentNodeI[] = []

  // push all nodes at the minimum depth to the top of the tree
  for (const comment_view of comments) {
    const cNode = map.get(comment_view.comment.id)
    if (cNode && cNode.depth == min_depth) {
      tree.push(cNode)
    }
  }

  for (const comment_view of comments) {
    const child = map.get(comment_view.comment.id)
    if (child) {
      const parent_id = getCommentParentId(comment_view.comment)
      if (parent_id) {
        const parent = map.get(parent_id)
        // Necessary because blocked comment might not exist
        if (parent) {
          parent.children.push(child)
        }
      }
    }
  }

  if (settings.aprilFools2026) {
    tree.unshift(getRandomAd(comments[0].post!))
  }

  return tree
}

function getRandomAd(post: Post): CommentNodeI {
  const ads: {
    username: string
    content: string
    actorId: string
    avatar: string
  }[] = [
    {
      username: 'DrinkCocaCola',
      content: `There's nothing quite like the crisp, invigorating taste of an ice-cold Coca-Cola. Each sip delivers a perfect balance of sweetness and sparkle, dancing across your taste buds with a refreshing burst that instantly lifts your mood. Whether you're sharing moments with friends or taking a well-dserved break, Coca-Cola brings a timeless sense of joy and satisfaction. It's more than just a drink—it's a classic experience, chilled to perfection and made to be enjoyed anytime.`,
      actorId: 'https://coca-cola.com/u/DrinkCocaCola',
      avatar: 'https://coca-cola.com/favicon.ico',
    },
    {
      username: 'UseApple',
      content: `There's nothing quite like the intuitive, ecosystem-driven actualization of a fully integrated Apple workflow. Each swipe delivers a perfect balance of disruptive innovation and user-centric bandwidth, cascading across your daily deliverables with a frictionless interface that instantly maximizes your core productivity. Whether you're onboarding new strategic verticals or taking a forward-thinking mindfulness break, Apple brings a best-in-class sense of interconnectivity and robust empowerment. It's more than just a smart device—it's a turnkey lifestyle solution, algorithmically optimized and made to be synchronized anytime.`,
      actorId: 'https://apple.com/u/UseApple',
      avatar: 'https://apple.com/favicon.ico',
    },
    {
      username: 'ImLovinIt',
      content: `There's nothing quite like the rapid-deployment, high-yield caloric deliverables of an optimized McDonald's value framework. Each bite delivers a perfect balance of scalable macros and cost-effective satisfaction, driving alignment across your palate with a standardized flavor profile that instantly incentivizes your lunch hour. Whether you're executing a drive-thru logistics pivot or leveraging our global supply chain for a quick break, McDonald's brings a robust sense of operational excellence and consumer-driven joy. It's more than just a meal—it's a mission-critical nutritional asset, strategically assembled and made to be actioned anytime.`,
      actorId: 'https://mcdonalds.com/u/ImLovinIt',
      avatar:
        'https://www.mcdonalds.com/content/dam/sites/usa/nfl/icons/favicon.ico',
    },
  ]

  const ad = ads[Math.floor(Math.random() * ads.length)]

  return {
    children: [],
    comment_view: {
      banned_from_community: false,
      community: {},
      comment: {
        ap_id: 'https://virus.com/comment/1',
        content: ad.content,
        creator_id: 1,
        deleted: false,
        distinguished: false,
        id: 1,
        language_id: 1,
        local: false,
        path: '0.1',
        post_id: 1,
        published: new Date().toISOString(),
        removed: false,
      },
      counts: {
        child_count: 0,
        comment_id: 1,
        downvotes: 0,
        upvotes: 9102384234098,
        published: new Date().toISOString(),
        score: 67,
      },
      creator: {
        actor_id: ad.actorId,
        banned: false,
        bot_account: false,
        deleted: false,
        id: 1,
        instance_id: 1,
        local: false,
        name: ad.username,
        published: new Date().toISOString(),
        avatar: ad.avatar,
      },
      post: post,
    },
    depth: 1,
    expanded: true,
  }
}

export function searchCommentTree(
  tree: CommentNodeI[],
  id: number,
): CommentNodeI | undefined {
  for (const node of tree) {
    if (node.comment_view.comment.id === id) {
      return node
    }

    for (const child of node.children) {
      const res = searchCommentTree([child], id)

      if (res) {
        return res
      }
    }
  }
  return undefined
}

export function insertCommentIntoTree(
  tree: CommentNodeI[],
  cv: CommentView,
  parentComment: boolean,
) {
  // Building a fake node to be used for later
  const node: CommentNodeI = {
    comment_view: cv,
    children: [],
    depth: 0,
  }

  const parentId = getCommentParentId(cv.comment)
  if (parentId) {
    const parent_comment = searchCommentTree(tree, parentId)
    if (parent_comment) {
      node.depth = parent_comment.depth + 1
      parent_comment.children.unshift(node)
    }
  } else if (!parentComment) {
    tree.unshift(node)
  }
}
