import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TagManager from 'react-gtm-module';
import PokedexSearchTemplate from './components/PokedexSearchTemplate';
import PokedexSearchBar from './components/PokedexSearchBar';
import PokedexSearchOptionList from './components/PokedexSearchOptionList';
import PokedexSearchResultList from './components/PokedexSearchResultList';
import PokedexSearchResultItem from './components/PokedexSearchResultItem';

const fieldsDict = {
  names: {
    ko: '정확한 이름',
    en: 'Exact Name',
  },
  num: {
    ko: '전국도감 번호',
    en: 'National Dex Number',
  },
  types: {
    ko: '타입',
    en: 'Type',
    option: [
      'find',
      'eff__x4',
      'eff__x2',
      'eff__x1',
      'eff__l2',
      'eff__l4',
      'eff__x0',
      'count',
    ],
  },
  basestats: {
    ko: '종족값',
    en: 'Base Stats',
    option: ['total', 'hp', 'atk', 'def', 'spa', 'spd', 'spe', 'all', 'any'],
  },
  abilities: {
    ko: '특성',
    en: 'Ability',
    option: ['find', 'count'],
  },
  learnset: {
    ko: '배우는 기술',
    en: 'Learnable Move',
  },
  nameko: {
    ko: '한글 이름',
    en: 'Korean Name',
  },
  name: {
    ko: '영어 이름',
    en: 'English Name',
  },
  tags: {
    ko: '분류',
    en: 'Tag',
  },
  evos: {
    ko: '진화',
    en: 'Evolution',
    option: ['count', 'find'],
  },
  color: {
    ko: '색상',
    en: 'Color',
  },
  heightm: {
    ko: '키 (m)',
    en: 'Height (m)',
  },
  weightkg: {
    ko: '무게 (kg)',
    en: 'Weight (kg)',
  },
  genderratio: {
    ko: '성비',
    en: 'Gender Ratio',
    option: ['M', 'F'],
  },
  gender: {
    ko: '성별',
    en: 'Gender',
  },
  egggroups: {
    ko: '알 그룹',
    en: 'Egg Groups',
    option: ['find', 'count'],
  },
  formeorder: {
    ko: '여러 모습',
    en: 'Multiple Formes',
    option: ['count'],
  },
  cangigantamax: {
    ko: '거다이맥스',
    en: 'Gigantamax',
    option: ['notnull'],
  },
  cannotdynamax: {
    ko: '다이맥스 불가',
    en: 'Cannot Dynamax',
  },
  prevo: {
    ko: '진화 전',
    en: 'Pre-Evolution',
  },
  evolevel: {
    ko: '진화 레벨',
    en: 'Evolution Level',
  },
  tier: {
    ko: 'Smogon 티어',
    en: 'Smogon Tier',
  },
  isnonstandard: {
    ko: '존재 불가',
    en: 'Non-Standard',
    option: ['isnull', 'notnull', 'find'],
  },
};

const optionDict = {
  find: {
    ko: '이름',
    en: 'Name',
  },
  count: {
    ko: '개수',
    en: 'Count',
  },
  isnull: {
    ko: '없음',
    en: 'Does Not Exist',
  },
  notnull: {
    ko: '있음',
    en: 'Exists',
  },
  contains: {
    ko: '포함',
    en: 'Contains',
  },
  M: {
    ko: '수컷',
    en: 'Male',
  },
  F: {
    ko: '암컷',
    en: 'Female',
  },
  total: {
    ko: '총합',
    en: 'Total',
  },
  hp: {
    ko: '체력',
    en: 'HP',
  },
  atk: {
    ko: '공격',
    en: 'Attack',
  },
  def: {
    ko: '방어',
    en: 'Defense',
  },
  spa: {
    ko: '특수공격',
    en: 'Sp. Atk',
  },
  spd: {
    ko: '특수방어',
    en: 'Sp. Def',
  },
  spe: {
    ko: '스피드',
    en: 'Speed',
  },
  all: {
    ko: '모두',
    en: 'All',
  },
  any: {
    ko: '하나라도',
    en: 'Any',
  },
  eff__x4: {
    ko: '4배',
    en: 'x4',
  },
  eff__x2: {
    ko: '2배 이상',
    en: 'x2 or more',
  },
  eff__x1: {
    ko: '1배',
    en: 'x1',
  },
  eff__l2: {
    ko: '0.5배 이하',
    en: 'x0.5 or less',
  },
  eff__l4: {
    ko: '0.25배 이하',
    en: 'x0.25 or less',
  },
  eff__x0: {
    ko: '무효',
    en: 'Immune',
  },
  Restricted_Legendary: {
    ko: '초전설',
    en: 'Restricted',
  },
  Sub_Legendary: {
    ko: '준전설',
    en: 'Sub-Legendary',
  },
  Mythical: {
    ko: '환상',
    en: 'Mythical',
  },
};

const PokedexSearch = () => {
  const [pokedex, setPokedex] = useState(null);
  const [typechart, setTypechart] = useState(null);
  const [abilities, setAbilities] = useState(null);
  const [moves, setMoves] = useState(null);
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState([
    {
      id: 1,
      operator: '&',
      field: '존재 불가 "없음"',
      term: '',
      query: '%2Bisnonstandard__isnull:',
    },
  ]);

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
            '/dex_api/typechart/?display=index,damagetaken,nameko',
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
    const fetchMoves = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_POKEMOEM_API +
            '/dex_api/moves/?display=index,name,nameko&query=%2Bisz__isnull:%2Dismax:true',
        );
        const movesList = [...response.data];
        movesList.sort((a, b) =>
          a.nameko < b.nameko ? -1 : a.nameko > b.nameko ? 1 : 0,
        );
        const newMovesList = [];
        for (let move of movesList) {
          if (move.nameko.includes('거다이')) {
            continue;
          }
          if (move.nameko === '잠재파워') {
            if (
              !newMovesList.find((option) => option.includes('hiddenpower'))
            ) {
              newMovesList.push(move.index);
              optionDict[move.index] = { ko: move.nameko, en: move.name };
            }
          } else {
            newMovesList.push(move.index);
            optionDict[move.index] = { ko: move.nameko, en: move.name };
          }
        }
        setMoves(newMovesList);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    if (dragging) return;
    fetchPokedex();
    fetchTypechart();
    fetchAbilities();
    fetchMoves();
  }, [dragging, options]);

  const location = useLocation();
  const query = location.search;
  // TODO: function that parses query and set options

  const nextId = useRef(2);
  let navigate = useNavigate();

  const onInsert = useCallback(
    (operator, field, option, term) => {
      const compare = (option1, option2) => {
        const newOption1 = { ...option1, id: 0 };
        const newOption2 = { ...option2, id: 0 };
        return JSON.stringify(newOption1) === JSON.stringify(newOption2);
      };

      let fieldOption;
      if (operator.operator === '-') {
        operator.url = '~';
      }
      if (option.option === '') {
        fieldOption = fieldsDict[field.field].ko;
      } else {
        fieldOption =
          fieldsDict[field.field].ko +
          ' "' +
          optionDict[option.option].ko +
          '"';
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
      <PokedexSearchBar
        fieldsDict={fieldsDict}
        optionDict={optionDict}
        typechart={typechart}
        abilities={abilities}
        moves={moves}
        onInsert={onInsert}
      />
      <PokedexSearchOptionList
        options={options}
        setOptions={setOptions}
        setDragging={setDragging}
        typechart={typechart}
        onRemove={onRemove}
      />
      {pokedex ? (
        <PokedexSearchResultList pokedex={pokedex} />
      ) : (
        <PokedexSearchResultItem
          pokemon={{
            num: 0,
            name: 'loading',
            nameko: '서버와 이야기하는 중!',
            iconfilename: null,
          }}
        />
      )}
    </PokedexSearchTemplate>
  );
};

export default PokedexSearch;
