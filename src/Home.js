import { Link } from 'react-router-dom';
import styles from './CSSModule.module.scss';

const Home = () => {
  return (
    <div className={styles.wrapper}>
      <h1>Home</h1>
      <p>
        This is <span className="aquatext">Pokémoem 2.0 Alpha</span> Homepage.
      </p>
      <ul>
        <li>
          <Link to="/pokedex">Pokédex Search</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
