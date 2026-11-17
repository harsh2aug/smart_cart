import { useId } from 'react';

// Label + input + error message.
// Every other prop (name, type, value, onChange...) is passed to the <input>.
export default function TextField({ label, error, ...inputProps }) {
  const id = useId(); // a unique id, so clicking the label focuses the input
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1 block h-12 w-full rounded-xl border px-4 text-base outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:ring-red-200'
            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
        }`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
