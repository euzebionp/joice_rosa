'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readBag } from '@/lib/bag';

export function BagLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      setCount(readBag().reduce((total, item) => total + item.quantity, 0));
    };

    update();
    window.addEventListener('storage', update);
    window.addEventListener('joice-bag-updated', update);

    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('joice-bag-updated', update);
    };
  }, []);

  return (
    <Link href="/sacola" className="header-bag" aria-label={`Sacola com ${count} itens`}>
      <span>Sacola</span>
      <span className="header-bag__count">{count}</span>
    </Link>
  );
}
