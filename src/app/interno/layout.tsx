import { AuthGate } from '@/components/internal/AuthGate'
import { InternalShell } from '@/components/internal/InternalShell'

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <InternalShell>{children}</InternalShell>
    </AuthGate>
  )
}
