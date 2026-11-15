import Link from 'next/link';
import { BagLink } from './BagLink';

const links = [
  { href: '/produtos', label: 'Perfumes' },
  { href: '/produtos?family=FLORAL', label: 'Florais' },
  { href: '/produtos?family=AMADEIRADO', label: 'Amadeirados' },
  { href: '/produtos?family=ORIENTAL', label: 'Orientais' },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label="Joice Rosa Cosméticos">
          <span className="brand__mark">JR</span>
          <span className="brand__name">
            Joice Rosa
            <small>Cosméticos</small>
          </span>
        </Link>

        <nav className="nav" aria-label="Navegação principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/produtos" className="header-search">
            Buscar
          </Link>
          <BagLink />
        </div>

        <details className="mobile-nav">
          <summary>Menu</summary>
          <div className="mobile-nav__panel">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/sacola">Sacola</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
