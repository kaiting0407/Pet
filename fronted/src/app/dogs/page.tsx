import { Searchdogs } from "@/components/component/searchdogs";
import AllDog from  "@/components/component/alldog";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AllDog></AllDog>
    </main>
  );
}