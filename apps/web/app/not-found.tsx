import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <div className="container empty-state empty-state--page">
        <p className="eyebrow">404</p>
        <h1>Essência não encontrada.</h1>
        <p>
          O perfume que você procura não está mais disponível ou o endereço
          foi alterado.
        </p>
        <Link href="/produtos" className="btn btn--primary">
          Ver a coleção
        </Link>
      </div>
    </main>
  );
}
