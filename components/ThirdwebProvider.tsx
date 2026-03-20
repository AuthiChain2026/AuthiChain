'use client'

import { ThirdwebProvider } from 'thirdweb/react'

export function AuthiChainThirdwebProvider({ children }: { children: React.ReactNode }) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>
}
