import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black bg-center bg-cover bg-home-img">
      <main className="flex flex-col justify-center mx-auto max-w-5xl text-center h-dvh">
        <div className="flex flex-col gap-6 p-12 mx-auto w-4/5 text-white rounded-xl bg-black/90 sm:max-w-96 sm:text-2xl">
          <h1 className="text-4xl font-bold">
            Dan&apos;s Computer <br />
            Repair Shop
          </h1>
          <address>
            555 Gateway Lane
            <br />
            San Francisco, CA 94107
          </address>
          <p>Open Daily 9am - 5pm</p>
          <Link className="hover:underline" href="tel:5555555555">
            555-555-5555
          </Link>
        </div>
      </main>
    </div>
  );
}
