import React from 'react';
import './PokedexSearchResultItem.scss';
import PokemonIcon from './PokemonIcon';

const PokedexSearchResultItem = ({ pokemon, style }) => {
  const { num, name, nameko, iconfilename } = pokemon;
  return (
    <div className="PokedexSearchResultItem-window" style={style}>
      <div className="PokedexSearchResultItem">
        <PokemonIcon num={num} iconfilename={iconfilename} />
        <a
          className="pokemon-name"
          href={'https://pokemoem.com/pokedex/' + name}
          target="_blank"
        >
          {nameko}
        </a>
      </div>
    </div>
  );
};

export default React.memo(PokedexSearchResultItem);
