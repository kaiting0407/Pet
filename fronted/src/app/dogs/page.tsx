import { Searchdogs } from "@/components/component/searchdogs";
import AllDog from  "@/components/component/alldog";
import  Header  from "@/components/component/Header";
export default function Home() {
  return (
    <div>
    <Header></Header>
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <AllDog></AllDog>
    </main>
    </div>
  );
}