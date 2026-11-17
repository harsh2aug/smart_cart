// The frame around login, register and the other sign-in pages (made for phones first)
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-svh bg-orange-50 px-4 py-10">
      <div className="mx-auto w-full max-w-sm">
        <p className="text-center text-2xl font-bold text-orange-600">SmartCart</p>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
