import { useState, useCallback } from 'react';
import { MdAdd } from 'react-icons/md';
import PokedexSearchOptionFieldSelect from './PokedexSearchOptionFieldSelect';
import PokedexSearchOptionFieldSelectSecondary from './PokedexSearchOptionFieldSelectSecondary';
import './PokedexSearchBar.scss';

const searchTip = {
  names: <>이름은 한글이든 영어든 상관없지만, 정확해야 해요.</>,
  num: (
    <>
      숫자를 검색할 경우 점 두 개(..)로 범위를 나타낼 수 있어요.
      <br />
      예를 들어 20..30은 20부터 30까지를 의미해요.
      <br />
      참고로, 포켓몬의 '세대 구분'은 다음과 같아요!
      <br />
      1세대: 1..151 / 2세대: 152..251
      <br />
      3세대: 252..386 / 4세대: 387..493
      <br />
      5세대: 494..649 / 6세대: 650..721
      <br />
      7세대: 722..807 / 8세대: 808..905
    </>
  ),
  types: (
    <>
      타입을 한글로 검색하세요. 타입의 효과에 따라 필터링할 수도 있답니다.
      <br />
      개수 옵션의 경우, 1 또는 2를 입력하면 해당 개수만큼의 타입을 가진 포켓몬만
      나타나요.
    </>
  ),
  basestats: (
    <>
      종족값은 각 능력치뿐 아니라 '총합', '모두', '하나라도'의 옵션이 있어요.
      <br />
      참고로 숫자를 검색할 경우 점 두 개(..)로 범위를 나타낼 수 있어요.
      <br />
      예를 들어 20..30은 20부터 30까지를 의미해요.
    </>
  ),
  abilities: <>특성을 한글로 검색하거나, 특성의 개수로 필터링할 수도 있어요.</>,
  nameko: <>한글 이름은 똑같지 않아도 검색해 줘요.</>,
  name: <>영어 이름은 똑같지 않아도 검색해 줘요.</>,
  heightm: (
    <>
      숫자를 검색할 경우 점 두 개(..)로 범위를 나타낼 수 있어요.
      <br />
      예를 들어 20..30은 20부터 30까지를 의미해요.
    </>
  ),
  weightkg: (
    <>
      숫자를 검색할 경우 점 두 개(..)로 범위를 나타낼 수 있어요.
      <br />
      예를 들어 20..30은 20부터 30까지를 의미해요.
    </>
  ),
  genderratio: (
    <>
      수컷과 암컷의 비율은 0.5 대 0.5에요.
      <br />
      이 기본적인 비율을 벗어나는 포켓몬을 검색할 수 있어요.
      <br />
      예를 들어, 0.75..로 검색하면 해당 성별 비율이 0.75 이상인 포켓몬을
      검색해요.
      <br />
      단, 성별이 한쪽만 있는 포켓몬은 이 옵션으로 검색할 수 없으니 '성별'
      옵션으로 따로 검색해 주세요.
    </>
  ),
  evos: (
    <>
      존재하는 진화 루트의 개수나, 진화한 포켓몬의 이름으로 검색할 수 있어요.
      <br />
      진화 루트는 같은 종이라도 변경 불가능한 폼체인지라면 각각 하나씩 세어요.
    </>
  ),
  egggroups: (
    <>
      알 그룹에는 괴수, 식물, 드래곤, 수중1, 수중2, 수중3, 벌레, 비행, 육상,
      요정, 인간형, 광물, 부정형, 메타몽, 미발견이 있어요.
      <br />각 포켓몬은 하나 또는 두 개의 알 그룹을 가져요.
    </>
  ),
  tier: (
    <>
      <a href="https://smogon.com" target="_blank">
        Smogon University
      </a>
      의 티어제는 포켓몬을 AG, Uber, OU, UU, RU, NU, PU, NFE, LC, Illegal 등으로
      나눠요.
    </>
  ),
  prevo: <>진화 전 단계의 이름으로 검색할 수 있는 옵션이에요.</>,
  evolevel: (
    <>
      레벨 진화를 하는 포켓몬 중에서만, 진화 레벨로 검색할 수 있어요.
      <br />
      참고로 숫자를 검색할 경우 점 두 개(..)로 범위를 나타낼 수 있어요.
      <br />
      예를 들어 20..30은 20부터 30까지를 의미해요.
    </>
  ),
  formeorder: (
    <>
      여러 모습이 존재하는 포켓몬들을 찾아줘요.
      <br />
      검색 결과에는 기본 모습만 나타나는 점에 주의!
    </>
  ),
  cangigantamax: (
    <>거다이맥스 가능한 포켓몬을 찾아줘요. 검색어는 입력하지 않아도 돼요.</>
  ),
  isnonstandard: (
    <>
      소드/실드의 필드 상에 존재 불가능한 포켓몬들을 찾아줘요. <br />
      '없음' 옵션은 기본적으로 모든 존재불가 포켓몬을 걸러줘요.
      <br />
      '있음' 옵션은 반대로 존재불가 포켓몬들만 보여주죠.
      <br />
      '이름' 옵션을 켜면 검색어를 입력할 수 있는데, 가능한 검색어는:
      <br />
      Past (과거작에서만 존재 가능)
      <br />
      Future (히스이지방에만 존재 가능)
      <br />
      Gigantamax (거다이맥스라서 필드에서는 존재 불가)
      <br />
      Unobtainable (어떤 방법으로든 존재 불가)
    </>
  ),
  gender: (
    <>
      한쪽 성별만 있는 포켓몬을 골라줘요. 검색어는 M(수컷), F(암컷)만 가능해요.
    </>
  ),
  tags: (
    <>
      포켓몬의 전설 또는 환상 분류에 따라 골라줘요.
      <br />
      검색어는 초전설, 준전설, 환상만 가능해요.
    </>
  ),
  cannotdynamax: (
    <>
      이 옵션을 체크하고 '예'를 입력하면 다이맥스할 수 없는 가라르 본토 전설
      삼형제만 선택돼요.
      <br />
      '아니오'를 입력하면 그 세 마리를 제외하고 검색돼요.
    </>
  ),
  learnset: (
    <>
      찾고 싶은 기술 하나를 선택하고, 검색어에는 원하는 세대(1~8)를 입력합니다.
      <br />
      참고로 숫자를 검색할 경우 점 두 개(..)로 범위를 나타낼 수 있어요.
      <br />
      예를 들어 6..8은 6부터 8까지를 의미해요.
    </>
  ),
  color: (
    <>
      빨강, 노랑, 초록, 파랑, 보라, 분홍, 갈색, 검정, 회색, 하양의 10가지
      검색어가 가능해요! 색상 분류가 정확하진 않아요 ㅎㅎ..
    </>
  ),
};

const eggChart = [
  { ko: '괴수', en: 'Monster' },
  { ko: '식물', en: 'Grass' },
  { ko: '드래곤', en: 'Dragon' },
  { ko: '수중1', en: 'Water 1' },
  { ko: '수중2', en: 'Water 2' },
  { ko: '수중3', en: 'Water 3' },
  { ko: '벌레', en: 'Bug' },
  { ko: '비행', en: 'Flying' },
  { ko: '육상', en: 'Field' },
  { ko: '요정', en: 'Fairy' },
  { ko: '인간형', en: 'Human-Like' },
  { ko: '광물', en: 'Mineral' },
  { ko: '부정형', en: 'Amorphous' },
  { ko: '메타몽', en: 'Ditto' },
  { ko: '미발견', en: 'Undiscovered' },
];

const colors = [
  { ko: '검정', en: 'Black' },
  { ko: '파랑', en: 'Blue' },
  { ko: '갈색', en: 'Brown' },
  { ko: '회색', en: 'Gray' },
  { ko: '초록', en: 'Green' },
  { ko: '분홍', en: 'Pink' },
  { ko: '보라', en: 'Purple' },
  { ko: '빨강', en: 'Red' },
  { ko: '하양', en: 'White' },
  { ko: '노랑', en: 'Yellow' },
];

const PokedexSearchBar = ({
  fieldsDict,
  optionDict,
  typechart,
  abilities,
  moves,
  onInsert,
}) => {
  const [operator, setOperator] = useState({ operator: '&', url: '%2B' });
  const [field, setField] = useState({ field: 'names', url: '' });
  const [secondSelectField, setSecondSelectField] = useState([]);
  const [option, setOption] = useState({ option: '', url: '' });
  const [value, setValue] = useState('');

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onSelectOperator = useCallback((e) => {
    const operatorObject = { operator: e.target.value, url: e.target.value };
    if (e.target.value === '&') {
      operatorObject.url = '%2B';
    } else if (e.target.value === '-') {
      operatorObject.url = '%2D';
    }
    setOperator(operatorObject);
  }, []);

  const onSelectField = useCallback(
    (e) => {
      const fieldObject = { field: e.target.value, url: e.target.value };
      if (e.target.value === 'names') {
        fieldObject.url = '';
      }
      if (e.target.value === 'learnset') {
        setSecondSelectField(moves);
      } else if (fieldsDict[e.target.value].hasOwnProperty('option')) {
        setSecondSelectField(fieldsDict[e.target.value].option);
        const firstOption = fieldsDict[e.target.value].option[0];
        const optionObject = { option: firstOption, url: firstOption };
        if (firstOption === 'find') {
          optionObject.url = '';
        }
        setOption(optionObject);
      } else {
        setSecondSelectField([]);
        setOption({ option: '', url: '' });
      }
      setField(fieldObject);
    },
    [fieldsDict, moves],
  );

  const onSelectOption = useCallback((e) => {
    setOption({ option: e.target.value, url: e.target.value });
  }, []);

  const onSubmit = useCallback(
    (e) => {
      const capitalize = ([first, ...rest]) => {
        return [first.toUpperCase(), ...rest].join('');
      };
      let term = { term: value, url: value };
      if (field.field === 'types' && option.option !== 'count') {
        const type = typechart.find((type) => type.nameko === value);
        if (type) {
          term.url = capitalize(type.index);
        }
      }
      if (field.field === 'abilities' && option.option !== 'count') {
        const ability = abilities.find((ability) => ability.nameko === value);
        if (ability) {
          term.url = ability.name;
        }
      }
      if (field.field === 'learnset') {
        term.term += '세대';
      }
      if (field.field === 'color') {
        const color = colors.find((str) => str.ko === value);
        if (color) {
          term.url = color.en;
        }
      }
      if (field.field === 'egggroups' && option.option !== 'count') {
        const eggGroup = eggChart.find((group) => group.ko === value);
        if (eggGroup) {
          term.url = eggGroup.en;
        }
      }
      if (field.field === 'tags') {
        if (term.term === '초전설') term.url = 'Restricted%20Legendary';
        if (term.term === '준전설') term.url = 'Sub-Legendary';
        if (term.term === '환상') term.url = 'Mythical';
      }
      if (field.field === 'cannotdynamax') {
        if (term.term === '예') term.url = 't';
        if (term.term === '아니오') term.url = 'a';
      }
      onInsert(operator, field, option, term);
      setValue('');
      e.preventDefault();
    },
    [onInsert, operator, field, option, value, typechart, abilities],
  );

  return (
    <>
      <div className="search-tip">{searchTip[field.field]}</div>
      <form className="PokedexSearchBar" onSubmit={onSubmit}>
        <select
          className="operator-search"
          value={operator.operator}
          onChange={onSelectOperator}
        >
          <option value="&">&</option>
          <option value="|">|</option>
          <option value="-">-</option>
        </select>
        <PokedexSearchOptionFieldSelect
          fieldsDict={fieldsDict}
          field={field.field}
          onChange={onSelectField}
        />
        {secondSelectField.length ? (
          <select
            className="operator-search"
            value={option.option}
            onChange={onSelectOption}
          >
            {secondSelectField.map((option) => (
              <PokedexSearchOptionFieldSelectSecondary
                optionDict={optionDict}
                option={option}
                key={option}
              />
            ))}
          </select>
        ) : null}
        <input placeholder="검색어" value={value} onChange={onChange} />
        <button type="submit">
          <MdAdd />
        </button>
      </form>
    </>
  );
};

export default PokedexSearchBar;
