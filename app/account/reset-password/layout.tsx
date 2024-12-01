export const metadata = {
  title: 'Citale | Reset Password',
  description: 'Reset your password',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
