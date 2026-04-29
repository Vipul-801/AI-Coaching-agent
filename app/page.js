import { UserButton } from "@stackframe/stack";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div> suscribe to Dikshant </div>
      <button variant="destructive"> suscribe </button>
      <br/>

      <Link href={"/dashboard"}>
        <button variant="destructive" className="m-5 "> Go to Dashboard </button>
      </Link>
      <UserButton />
    </>
  );
}
