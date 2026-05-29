import { Phone } from 'lucide-react'
import { getWhatsAppUrl, cn } from '@/lib/utils'

interface WhatsAppPhoneLinkProps {
  phone: string
  className?: string
}

export default function WhatsAppPhoneLink({ phone, className }: WhatsAppPhoneLinkProps) {
  const url = getWhatsAppUrl(phone)
  if (!url) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'text-sm text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors',
        className
      )}
      title="Open in WhatsApp"
    >
      <Phone className="w-4 h-4 shrink-0" />
      {phone}
    </a>
  )
}
