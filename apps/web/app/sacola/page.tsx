import type { Metadata } from 'next';
import { BagClient } from '@/components/BagClient';

export const metadata: Metadata = {
  title: 'Sacola',
  description: 'Revise os perfumes escolhidos e conclua seu pedido.',
};

export default function BagPage() {
  return (
    <main className="page">
      <div className="container">
        <header className="page-head">
          <p className="eyebrow">Sua seleção</p>
          <h1>Sacola</h1>
        </header>
        <BagClient />
      </div>
    </main>
  );
}
