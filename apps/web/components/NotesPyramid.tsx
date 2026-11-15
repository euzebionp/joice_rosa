import type { ProductNotes } from '@joice/domain';

export function NotesPyramid({ notes }: { notes: ProductNotes }) {
  const rows = [
    { label: 'Saída', description: 'Primeiras impressões', values: notes.top },
    { label: 'Corpo', description: 'A assinatura', values: notes.heart },
    { label: 'Fundo', description: 'A memória que fica', values: notes.base },
  ];

  return (
    <section className="notes" aria-labelledby="notas-titulo">
      <div className="notes__head">
        <h2 id="notas-titulo">Pirâmide olfativa</h2>
        <span>Uma leitura em três tempos</span>
      </div>

      <div className="notes__rows">
        {rows.map((row, index) => (
          <div className="notes__row" key={row.label}>
            <div
              className="notes__marker"
              style={{ opacity: 1 - index * 0.22 }}
              aria-hidden="true"
            />
            <div className="notes__copy">
              <strong>{row.label}</strong>
              <small>{row.description}</small>
            </div>
            <div className="notes__chips">
              {row.values.map((note) => (
                <span className="note-chip" key={note}>
                  {note}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
