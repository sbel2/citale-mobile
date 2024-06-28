import Link from "next/link";
import Image from "next/legacy/image";

export default function Header({ font }: { font?: string }) {
  return (
    <header className="py-10 pb-4 bg-gray-952 ml-2">
      <div className="max-w- [100rem] px-12 mx-auto flex justify-between">
        <Link href="/">
            <Image
              src="https://qteefmlwxyvxjvehgjvp.supabase.co/storage/v1/object/public/website%20logo/citale_logo.png" 
              alt="Citale" 
              width={110}
              height={40}
              layout="fixed" 
            />
        </Link>
      </div>
    </header>
  );
}
