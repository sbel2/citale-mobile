import Link from "next/link";

export default function Header({ font }: { font?: string }) {
  return (
    <header className="py-10 pb-4 bg-gray-952">
      <div className="max-w- [100rem] px-12 mx-auto flex justify-between">
        <Link href="/">
          <h1 id="name" className={` uppercase text-3xl text-purple-500 text-center py-2 ${font}`}
          style={{ color: '#57356a' }}>
            Citale
          </h1>
        </Link>
      </div>
    </header>
  );
}
