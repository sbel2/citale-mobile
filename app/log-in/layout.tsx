export const metadata = {
    title: 'Citale | Log in',
    description: 'Thank you joining Citale!',
  }
  
  import '../globals.css';
  
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
  