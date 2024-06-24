import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: 'AskAway - Sign Up',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
