import { useEffect, useState } from 'react';

const WAIT_SECONDS = 60; // same as the server: one new code per minute

// Shows "Resend code in 42s", and after the countdown a "Resend code" button.
// onResend must return true when the code was sent, false when it failed.
export default function ResendButton({ onResend }) {
  const [secondsLeft, setSecondsLeft] = useState(WAIT_SECONDS);
  const [isSending, setIsSending] = useState(false);

  // Every second: secondsLeft goes down by 1, until it reaches 0
  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer); // clean up if the page closes first
  }, [secondsLeft]);

  async function handleClick() {
    setIsSending(true);
    const isSent = await onResend();
    setIsSending(false);
    if (isSent) {
      setSecondsLeft(WAIT_SECONDS); // start the countdown again
    }
  }

  if (secondsLeft > 0) {
    return <p className="text-center text-sm text-gray-500">Resend code in {secondsLeft}s</p>;
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSending}
      className="w-full text-center text-sm font-semibold text-orange-600 disabled:opacity-60"
    >
      {isSending ? 'Sending…' : 'Resend code'}
    </button>
  );
}
