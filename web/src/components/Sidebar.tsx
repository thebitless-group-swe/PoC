import {
  Archive,
  FileText,
  FolderClosed,
  HelpCircle,
  Plus,
  Settings,
  Star,
} from 'lucide-react'

import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  icon: typeof FileText
  disabled?: boolean
  active?: boolean
}

const primaryItems: NavItem[] = [
  { label: 'New Note', icon: Plus, active: true },
  { label: 'All Notes', icon: FileText },
  { label: 'Favorites', icon: Star, disabled: true },
  { label: 'Folders', icon: FolderClosed, disabled: true },
  { label: 'Archive', icon: Archive, disabled: true },
]

const footerItems: NavItem[] = [
  { label: 'Settings', icon: Settings },
  { label: 'Support', icon: HelpCircle },
]

function NavButton({ label, icon: Icon, disabled, active }: NavItem) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
        'text-foreground/80 hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active && 'bg-muted font-medium text-foreground',
        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-foreground/80',
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </button>
  )
}

export function Sidebar() {
  return (
    <aside
      aria-label="Navigazione principale"
      className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card"
    >
      <div className="px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          My Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-2" aria-label="Sezioni">
        {primaryItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-border px-2 py-3">
        {footerItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
