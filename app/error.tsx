"use client";

export default function ErrorBoundary({
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <h1 className="text-2xl font-semibold">
        The platform status could not be displayed.
      </h1>
      <p className="mt-3 text-neutral-600">
        No sensitive error details were exposed.
      </p>
      <button
        className="mt-6 rounded-md bg-cyan-800 px-4 py-2 text-white"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
