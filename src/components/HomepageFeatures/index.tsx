import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    description: (
      <>
        KeraDB provides a simple, MongoDB-compatible SDK that's familiar to developers.
        No complex setup or configuration required.
      </>
    ),
  },
  {
    title: 'Lightweight & Fast',
    description: (
      <>
        Embedded database with minimal dependencies. Perfect for applications that need
        a database without the overhead of a separate server.
      </>
    ),
  },
  {
    title: 'Multi-Language Support',
    description: (
      <>
        Available for both Node.js and Python with consistent APIs across languages.
        Choose the language that works best for your project.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
