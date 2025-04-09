import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-9xl text-rose-700 font-extrabold font-mono font-stretch-extra-expanded">
          Welcome
        </h1>
        <form>
          <input name="email" type="email" className="px-5 py-2 border-2 border-gray-400 rounded-md" />
          <button type="submit" className="bg-rose-800 rounded-md py-2.5 px-2 text-white font-semibold mx-0.5 cursor-pointer">Submit</button>
        </form>
      </main>
    </div>
  );
}
