import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TagManager from 'react-gtm-module';
import PokedexSearchTemplate from './components/PokedexSearchTemplate';
import SearchBar from './components/Pokedex/SearchBar';
import PokedexSearchOptionList from './components/PokedexSearchOptionList';
import PokedexSearchResultList from './components/PokedexSearchResultList';
import PokedexSearchResultItem from './components/PokedexSearchResultItem';

const pokedexFieldsList = [
  { url: 'num', name: 'National Dex Number', nameko: '전국도감 번호' },
  { url: 'types__count', name: 'Type Count', nameko: '타입의 개수' },
  {
    url: 'basestats__total',
    name: 'Base Stats Total (BST)',
    nameko: '종족값 총합',
  },
  { url: 'basestats__hp', name: 'HP Stat', nameko: '체력 종족값' },
  { url: 'basestats__atk', name: 'Attack Stat', nameko: '공격 종족값' },
  { url: 'basestats__def', name: 'Defense Stat', nameko: '방어 종족값' },
  {
    url: 'basestats__spa',
    name: 'Special Attack Stat',
    nameko: '특수공격 종족값',
  },
  {
    url: 'basestats__spd',
    name: 'Special Defense Stat',
    nameko: '특수방어 종족값',
  },
  { url: 'basestats__spe', name: 'Speed Stat', nameko: '스피드 종족값' },
  { url: 'basestats__all', name: 'All of Base Stats', nameko: '종족값 전부' },
  {
    url: 'basestats__any',
    name: 'Any of Base Stats',
    nameko: '종족값 중 하나라도',
  },
  { url: 'learnset__mult', name: 'Multiple Moves', nameko: '여러 개의 기술' },
  { url: 'abilities__count', name: 'Ability Count', nameko: '특성의 개수' },
  {
    url: 'tags',
    name: 'Restricted Legendary Pokémon',
    nameko: '초전설 포켓몬',
    term: 'Restricted Legendary',
  },
  {
    url: 'tags',
    name: 'Sub-Legendary Pokémon',
    nameko: '준전설 포켓몬',
    term: 'Sub-Legendary',
  },
  {
    url: 'tags',
    name: 'Mythical Pokémon',
    nameko: '환상의 포켓몬',
    term: 'Mythical',
  },
  {
    url: 'evos__count',
    name: 'Evolution Count',
    nameko: '진화 형태의 개수',
  },
  { url: 'heightm', name: 'Height (m)', nameko: '키 (m)' },
  { url: 'weightkg', name: 'Weight (kg)', nameko: '무게 (kg)' },
  {
    url: 'formeorder__count',
    name: 'Number of Multiple Forms',
    nameko: '가진 여러 모습의 수',
  },
  {
    url: 'cangigantamax__notnull',
    name: 'Can Gigantamax',
    nameko: '거다이맥스할 수 있음',
    term: 't',
  },
  {
    url: 'cannotdynamax',
    name: 'Cannot Dynamax',
    nameko: '다이맥스할 수 없음',
    term: 't',
  },
  {
    url: 'isnonstandard__notnull',
    name: 'Non-Standard in Galar',
    nameko: '가라르에서 존재 불가',
    term: 't',
  },
  {
    url: 'isnonstandard',
    name: 'Past Generation Only',
    nameko: '과거작에서만 존재 가능',
    term: 'Past',
  },
  {
    url: 'isnonstandard',
    name: 'Hisui Only',
    nameko: '히스이에서만 존재 가능',
    term: 'Future',
  },
  {
    url: 'isnonstandard',
    name: 'Gigantamax Form',
    nameko: '거다이맥스의 모습',
    term: 'Gigantamax',
  },
  {
    url: 'isnonstandard',
    name: 'Unobtainable',
    nameko: '얻을 수 없음',
    term: 'Unobtainable',
  },
];

const eggChart = [
  { nameko: '괴수', name: 'Monster' },
  { nameko: '식물', name: 'Grass' },
  { nameko: '드래곤', name: 'Dragon' },
  { nameko: '수중1', name: 'Water 1' },
  { nameko: '수중2', name: 'Water 2' },
  { nameko: '수중3', name: 'Water 3' },
  { nameko: '벌레', name: 'Bug' },
  { nameko: '비행', name: 'Flying' },
  { nameko: '육상', name: 'Field' },
  { nameko: '요정', name: 'Fairy' },
  { nameko: '인간형', name: 'Human-Like' },
  { nameko: '광물', name: 'Mineral' },
  { nameko: '부정형', name: 'Amorphous' },
  { nameko: '메타몽', name: 'Ditto' },
  { nameko: '미발견', name: 'Undiscovered' },
];

const colors = [
  { nameko: '검정색', name: 'Black' },
  { nameko: '파란색', name: 'Blue' },
  { nameko: '갈색', name: 'Brown' },
  { nameko: '회색', name: 'Gray' },
  { nameko: '초록색', name: 'Green' },
  { nameko: '분홍색', name: 'Pink' },
  { nameko: '보라색', name: 'Purple' },
  { nameko: '빨간색', name: 'Red' },
  { nameko: '하얀색', name: 'White' },
  { nameko: '노란색', name: 'Yellow' },
];

const PokedexSearch = () => {
  const [pokedex, setPokedex] = useState(null);
  const [typechart, setTypechart] = useState(null);
  const [abilities, setAbilities] = useState(null);
  const [moves, setMoves] = useState(null);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pokemonList, setPokemonList] = useState(null);

  const [options, setOptions] = useState([
    {
      id: 0,
      operator: '-',
      field: '가라르에서 존재 불가',
      term: '예',
      query: '%7Eisnonstandard__notnull:',
    },
  ]);

  useEffect(() => {
    const fetchPokedex = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_POKEMOEM_API +
            '/dex_api/pokedex/?display=num,name,nameko,iconfilename',
        );
        setPokedex(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    const fetchTypechart = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_POKEMOEM_API +
            '/dex_api/typechart/?display=index,nameko',
        );
        setTypechart(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    const fetchAbilities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_POKEMOEM_API +
            '/dex_api/abilities/?display=name,nameko',
        );
        setAbilities(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_POKEMOEM_API +
            '/dex_api/items/?display=name,nameko',
        );
        setItems(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    const fetchMoves = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_POKEMOEM_API +
            '/dex_api/moves/?display=index,name,nameko&query=%2Bisz__isnull:%7Eismax:t%7Enameko:거다이%7Ename:hidden%20power%20',
        );
        setMoves(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchPokedex();
    fetchTypechart();
    fetchAbilities();
    fetchItems();
    fetchMoves();
  }, []);

  const makeDictionary = useCallback(() => {
    if (!pokedex || !typechart || !abilities || !moves || !items) return;
    const appendTags = (array, tag, sort) => {
      const arrayWithTags = [...array];
      if (sort) {
        arrayWithTags.sort((a, b) =>
          a.nameko > b.nameko ? 1 : a.nameko < b.nameko ? -1 : 0,
        );
      }
      for (let item of arrayWithTags) {
        item.tag = tag;
        if (!item.hasOwnProperty('name')) {
          item.name = item.index.charAt(0).toUpperCase() + item.index.slice(1);
        }
      }
      return arrayWithTags;
    };
    const pokedexWithTags = appendTags(pokedex, 'pokedex', true);
    const typechartWithTags = appendTags(typechart, 'types', true);
    const abilitiesWithTags = appendTags(abilities, 'abilities', true);
    const movesWithTags = appendTags(moves, 'moves', true);
    const itemsWithTags = appendTags(items, 'items', true);
    const eggchartWithTags = appendTags(eggChart, 'egggroups', true);
    const colorsWithTags = appendTags(colors, 'colors', true);
    const pokedexFieldsWithTags = appendTags(
      pokedexFieldsList,
      'options',
      false,
    );
    return [
      ...pokedexWithTags,
      ...typechartWithTags,
      ...abilitiesWithTags,
      ...movesWithTags,
      ...itemsWithTags,
      ...eggchartWithTags,
      ...colorsWithTags,
      ...pokedexFieldsWithTags,
    ];
  }, [pokedex, typechart, abilities, moves, items]);

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const fetchPokedex = async () => {
      setLoading(true);
      let queryParam = '';
      for (let option of options) {
        queryParam += option.query;
      }
      try {
        const response = await axios.get(
          process.env.REACT_APP_POKEMOEM_API +
            '/dex_api/pokedex/?display=num,name,nameko,iconfilename' +
            (queryParam && queryParam !== '' ? '&query=' + queryParam : ''),
        );
        setPokemonList(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    if (dragging) return;
    fetchPokedex();
  }, [dragging, options]);

  const location = useLocation();
  const query = location.search;
  // TODO: function that parses query and set options

  const nextId = useRef(1);
  let navigate = useNavigate();

  const onInsert = useCallback(
    (operator, field, option, term) => {
      const compare = (option1, option2) => {
        const newOption1 = { ...option1, id: 0 };
        const newOption2 = { ...option2, id: 0 };
        return JSON.stringify(newOption1) === JSON.stringify(newOption2);
      };

      let fieldOption;
      if (option.option === '') {
        fieldOption = field.field;
      } else {
        fieldOption = field.field + ' "' + option.option + '"';
      }
      let queryParam;
      if (field.url === '') {
        queryParam = operator.url + term.url;
      } else if (option.url === '') {
        queryParam = operator.url + field.url + ':' + term.url;
      } else {
        queryParam =
          operator.url + field.url + '__' + option.url + ':' + term.url;
      }
      const searchOption = {
        id: nextId.current,
        operator: operator.operator,
        field: fieldOption,
        term: term.term,
        query: queryParam,
      };
      for (option of options) {
        if (compare(option, searchOption)) return;
      }
      setOptions((options) => options.concat(searchOption));
      nextId.current += 1;
      const tagManagerArgs = {
        dataLayer: {
          event: 'pokedex-search',
          option_id: searchOption.id,
          option_operator: searchOption.operator,
          option_field: searchOption.field,
          option_term: searchOption.term,
        },
      };
      TagManager.dataLayer(tagManagerArgs);
    },
    [options],
  );

  const onRemove = useCallback((id) => {
    setOptions((options) => options.filter((option) => option.id !== id));
  }, []);

  return (
    <PokedexSearchTemplate>
      {!loading ? (
        <SearchBar dictionary={makeDictionary()} onInsert={onInsert} />
      ) : null}
      <PokedexSearchOptionList
        options={options}
        setOptions={setOptions}
        setDragging={setDragging}
        onRemove={onRemove}
      />
      {pokemonList ? (
        <PokedexSearchResultList pokedex={pokemonList} />
      ) : (
        <PokedexSearchResultItem
          pokemon={{
            num: 0,
            name: '',
            nameko: '서버와 이야기하는 중!',
            iconfilename: null,
          }}
        />
      )}
    </PokedexSearchTemplate>
  );
};

export default PokedexSearch;
