import styles from './page.module.css';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import ApiKeyForm from './components/ApiKeyForm';
import ApiKeyList from './components/ApiKeyList';

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <FeatureGrid />
      <section className={styles.keySection}>
        <ApiKeyForm />
        <ApiKeyList />
      </section>
    </main>
  );
}

