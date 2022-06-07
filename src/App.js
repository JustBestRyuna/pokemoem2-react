import { Routes, Route } from 'react-router-dom';
import TagManager from 'react-gtm-module';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet';
import Home from './Home';
import PokedexSearch from './PokedexSearch';

const App = () => {
  const tagManagerArgs = {
    gtmId: process.env.REACT_APP_GTM_ID,
  };

  TagManager.initialize(tagManagerArgs);

  ReactGA.initialize(process.env.REACT_APP_GA_ID);
  ReactGA.send('pageview');

  return (
    <>
      <Helmet>
        <title>Pokémoem 2.0 Alpha</title>
        <meta
          name="description"
          content="Pokémoem에 오신 것을 환영합니다! 포케모음은 포켓몬 배틀 정보 전문 웹사이트입니다."
          data-react-helmet="true"
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          data-react-helmet="true"
        ></meta>
        <meta charSet="UTF-8"></meta>
      </Helmet>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokedex" element={<PokedexSearch />} />
      </Routes>
    </>
  );
};

export default App;
