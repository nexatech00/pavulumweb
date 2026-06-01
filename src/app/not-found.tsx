import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C0C0C] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-white">404</h1>
        <h2 className="mt-4 font-serif text-xl text-white">Page not found</h2>
        <p className="mt-2 text-sm text-white/50">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm text-white transition-colors hover:bg-red-500"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
