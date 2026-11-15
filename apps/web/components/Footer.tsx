import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="brand__mark brand__mark--light">JR</span>
          <p>
            Perfumaria autoral brasileira. Composições criadas com tempo,
            matéria-prima nobre e respeito à sua pele.
          </p>
        </div>

        <div>
          <h3>Coleção</h3>
          <Link href="/produtos">Todos os perfumes</Link>
          <Link href="/produtos?family=FLORAL">Florais</Link>
          <Link href="/produtos?family=AMADEIRADO">Amadeirados</Link>
          <Link href="/produtos?family=ORIENTAL">Orientais</Link>
        </div>

        <div>
          <h3>Ajuda</h3>
          <Link href="/produtos">Encontrar meu perfume</Link>
          <Link href="/sacola">Minha sacola</Link>
          <span>Frete e prazos</span>
          <span>Trocas e devoluções</span>
        </div>

        <div>
          <h3>Atendimento</h3>
          <span>seg. a sex., 9h às 18h</span>
          <span>ola@joicerosa.com.br</span>
          <span>São Paulo · Brasil</span>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>© {new Date().getFullYear()} Joice Rosa Cosméticos</span>
        <span>Feito no Brasil · CNPJ 00.000.000/0001-00</span>
      </div>
    </footer>
  );
}
