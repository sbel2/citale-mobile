import '../globals.css';

export const metadata = {
  title: 'Citale | Account',
  description: 'Things to do in Boston',
};

export default function RootAccLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
