import GoogleAdsense, { infeedProps } from './GoogleAdsense';
import './PokedexSearchTemplate.scss';

const PokedexSearchTemplate = ({ children }) => {
  return (
    <div className="PokedexSearchTemplate">
      <div className="app-title">
        <img src="/favicon.ico" style={{ height: '50px', margin: '1rem' }} />
        Pokédex Search
      </div>
      <div className="content">{children}</div>
      <GoogleAdsense {...infeedProps} />
    </div>
  );
};

export default PokedexSearchTemplate;
