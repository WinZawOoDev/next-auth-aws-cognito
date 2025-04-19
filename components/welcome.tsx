import { auth } from "@/auth";
import { permanentRedirect } from "next/navigation";

async function handleFormAction(formData: FormData) {
  "use server";
  console.log("🚀 ~ handleFormAction ~ formData:", formData);
  const email = formData.get("email");
  console.log("🚀 ~ handleFormAction ~ email:", email);
}

export default async function Welcome() {
  const session = await auth();

  if (!session) {
    return permanentRedirect("/login");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-9xl text-rose-700 font-extrabold font-mono font-stretch-extra-expanded">
          Welcome
        </h1>
        <form action={handleFormAction}>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="px-5 py-2 border-2 border-gray-400 rounded-md placeholder:text-gray-300 placeholder:font-light"
          />
          <button
            type="submit"
            className="bg-rose-800 rounded-md py-2.5 px-4 text-white font-semibold mx-0.5 cursor-pointer"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
