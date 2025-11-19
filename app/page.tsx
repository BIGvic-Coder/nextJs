import Image from "next/image";
import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* Top banner */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>

      {/* Main content */}
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/* Left text content */}
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20 shadow-sm">
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>Welcome to Acme.</strong> This is the example for the{" "}
            <a
              href="https://nextjs.org/learn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Next.js Learn Course
            </a>{" "}
            brought to you by Vercel.
          </p>

          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500 md:text-base"
          >
            <span>Log in</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>

        {/* Right hero images */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Dashboard screenshot on desktop"
            priority
          />

          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Dashboard screenshot on mobile"
            priority
          />
        </div>
      </div>
    </main>
  );
}
