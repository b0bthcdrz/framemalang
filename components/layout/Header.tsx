import Link from 'next/link';
import Container from './Container';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/kategori/sosok', label: 'Sosok' },
  { href: '/kategori/heritage', label: 'Heritage' },
  { href: '/kategori/event', label: 'Event' },
  { href: '/artikel', label: 'Semua Artikel' }
];

export default function Header() {
  return (
    <header className="border-b bg-white">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-bold text-brand-900">Frame Malang</Link>
        <nav className="flex gap-4 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-slate-700 hover:text-brand-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
