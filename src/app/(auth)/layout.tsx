import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: 'SpeakOut - Sign Up',
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
