
export default function ErrorMessage({ message }: { message: string | null }) {
  if (!message) {
    throw new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return <>{message}</>;
}