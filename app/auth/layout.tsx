export const metadata = {
  title: 'Citlale | Sign Up',
  description: 'Thank you joining Citale!',
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
