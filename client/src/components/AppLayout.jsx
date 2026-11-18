import { Link } from 'react-router';

// The frame for vendor pages (after login): a top bar and the page content.
// backTo = where the back arrow goes; leave it out on the home page.
export default function AppLayout({ title, backTo, children }) {
  return (
    <div className="min-h-svh bg-orange-50">
      <header className="sticky top-0 z-10 border-b border-orange-100 bg-white">
        <div className="mx-auto flex h-14 max-w-md items-center gap-2 px-4">
          {backTo && (
            <Link
              to={backTo}
              aria-label="Back"
              className="-ml-2 flex size-10 items-center justify-center rounded-full text-xl text-gray-700 active:bg-gray-100"
            >
              ←
            </Link>
          )}
          <h1 className="truncate text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 py-6">{children}</main>
    </div>
  );
}
