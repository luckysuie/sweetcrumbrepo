import React from 'react'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const styles =
    variant === 'primary'
      ? 'bg-slate-900 text-white hover:bg-slate-800'
      : variant === 'secondary'
        ? 'bg-white/70 text-slate-900 ring-1 ring-black/10 hover:bg-white'
        : variant === 'danger'
          ? 'bg-rose-600 text-white hover:bg-rose-500'
          : 'bg-transparent text-slate-900 hover:bg-black/5'

  return <button {...props} className={cx(base, styles, className)} />
}

