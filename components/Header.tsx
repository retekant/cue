import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Cue
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/add" className="hover:underline">
            Add Item
          </Link>
          <Link href="/review" className="hover:underline">
            Review
          </Link>
        </nav>
      </div>
    </header>
  );
}