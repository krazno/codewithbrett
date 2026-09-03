export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-stone-800">
      <h1 className="font-serif text-2xl">Page not found</h1>
      <p className="mt-2 text-sm text-stone-600">
        <a href="/" className="underline hover:text-stone-900">
          Back to home
        </a>
      </p>
    </main>
  );
}
