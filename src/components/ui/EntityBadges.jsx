import { Mail, Globe, Phone, User, Building } from 'lucide-react'

const ENTITY_ICONS = {
  email:   Mail,
  domain:  Globe,
  phone:   Phone,
  person:  User,
  company: Building,
  org:     Building,
}

export default function EntityBadges({ entities = [] }) {
  if (!entities.length) return (
    <p className="text-text-muted text-sm text-center py-4">No entities extracted</p>
  )

  // Deduplicate
  const unique = entities.filter((e, i, arr) =>
    arr.findIndex(x => x.value === e.value) === i
  )

  return (
    <div className="flex flex-wrap gap-2">
      {unique.map((entity, i) => {
        const Icon = ENTITY_ICONS[entity.type?.toLowerCase()] || User
        return (
          <div key={i}
               className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                          bg-bg-primary border border-bg-border
                          text-text-secondary text-xs font-mono
                          hover:border-accent-cyan/30 hover:text-text-primary
                          transition-all duration-150">
            <Icon size={11} className="text-text-muted" />
            <span className="max-w-[180px] truncate">{entity.value}</span>
          </div>
        )
      })}
    </div>
  )
}