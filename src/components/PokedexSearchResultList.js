import React, { useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import PokedexSearchResultItem from './PokedexSearchResultItem';
import './PokedexSearchResultList.scss';

const PokedexSearchResultList = ({ pokedex }) => {
  const listRenderer = useCallback(
    ({ index, style }) => {
      const pokemon = pokedex[index];
      return (
        <PokedexSearchResultItem pokemon={pokemon} key={index} style={style} />
      );
    },
    [pokedex],
  );

  return (
    <FixedSizeList
      className="PokedexSearchResultList"
      width={512}
      height={365}
      itemCount={pokedex.length}
      itemSize={61}
      itemData={pokedex}
      style={{ outline: 'none' }}
    >
      {listRenderer}
    </FixedSizeList>
  );
};

export default React.memo(PokedexSearchResultList);
