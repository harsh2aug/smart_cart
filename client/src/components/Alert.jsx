const COLORS = {
  error: 'bg-red-50 text-red-700',
  success: 'bg-green-50 text-green-700',
};

// A coloured message box. Shows nothing when there is no message.
export default function Alert({ type = 'error', children }) {
  if (!children) {
    return null;
  }
  return (
    <p role="alert" className={`rounded-xl p-3 text-sm ${COLORS[type]}`}>
      {children}
    </p>
  );
}
