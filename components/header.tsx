import Link from "next/link";

export default function Header({ font }: { font?: string }) {
  return (
    <header className="py-2 bg-gray-952">
      <div className="max-w- [100rem] px-12 mx-auto flex justify-between">
        <Link href="/">
          <h1 className={`uppercase text-yellow-500 text-centerpy-2 ${font}`}>
            Cue Up
          </h1>
        </Link>
      </div>
    </header>
  );
}
