import '../../globals.css';
export const metadata = {
    title: 'Citale | Edit Profile',
    description: 'Edit Profile Page',
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
  