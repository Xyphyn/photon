/**
 * This enum represents a UI color as tailwind classes.
 */

export enum Color {
  'accent' = 'border border-black dark:border-white bg-black text-white\
    dark:bg-white dark:text-black hover:text-inherit hover:bg-transparent hover:dark:bg-transparent active:bg-black/10 active:dark:bg-white/10',
  'ghost' = 'bg-black/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-white/10 text-black dark:text-white border border-transparent',
  'secondary' = 'hover:bg-black/10 hover:dark:bg-white/10 text-black dark:text-white fill-black dark:fill-white',
  'danger' = 'border border-red-500 bg-red-500 text-white hover:text-red-500 hover:bg-transparent',
  'dangerSecondary' = 'hover:bg-red-500 text-red-500 hover:text-white',
  'border' = 'border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 hover:dark:bg-zinc-800',
}
