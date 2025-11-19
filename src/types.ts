export type Theme = 'dark' | 'light'

export interface NavItem {
  id: string
  label: string
}

export interface CardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  aside?: React.ReactNode
}
