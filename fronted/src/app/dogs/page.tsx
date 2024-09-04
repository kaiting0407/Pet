import { Searchdogs } from "@/components/component/searchdogs";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Searchdogs></Searchdogs>
      <Link href='/'>回首頁</Link>

    </main>
  );
}