// Big orange button (easy to tap on a phone). Disabled while a request is running.
export default function Button({ isLoading = false, children, ...props }) {
  return (
    <button
      disabled={isLoading}
      className="h-12 w-full rounded-xl bg-orange-600 font-semibold text-white active:bg-orange-700 disabled:opacity-60"
      {...props}
    >
      {isLoading ? 'Please wait…' : children}
    </button>
  );
}
