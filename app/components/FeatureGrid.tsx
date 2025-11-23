import styles from '../page.module.css';

const features = [
  {
    title: 'App Router',
    body: 'Route, stream, and cache UI with the modern Next.js router.'
  },
  {
    title: 'Styling',
    body: 'Use CSS Modules, Tailwind, or any supported styling solution.'
  },
  {
    title: 'API Routes',
    body: 'Add /app/api endpoints for server-side functionality.'
  },
  {
    title: 'Deploy',
    body: 'Deploy to Vercel or any Node.js host with a single command.'
  }
];

export default function FeatureGrid() {
  return (
    <section className={styles.grid}>
      {features.map((card) => (
        <article key={card.title} className={styles.card}>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </article>
      ))}
    </section>
  );
}

