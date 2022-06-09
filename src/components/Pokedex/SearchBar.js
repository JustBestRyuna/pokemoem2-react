import { useState, useCallback } from 'react';
import { isSearch } from 'hangul-chosung-search-js';
import './SearchBar.scss';
import OptionField from './OptionField';

const operatorList = [
  {
    nameko: '결과 내 재검색',
    name: 'AND',
  },
  {
    nameko: '검색 조건 추가',
    name: 'OR',
  },
  {
    nameko: '제외 조건 추가',
    name: 'NOT',
  },
];

const learnsetTermList = [
  {
    nameko: '랭크배틀 가능 (8세대)',
    name: 'BS Legal (Gen 8)',
    url: '8',
  },
  {
    nameko: '7세대',
    name: 'Gen 7',
    url: '7',
  },
  {
    nameko: '6세대',
    name: 'Gen 6',
    url: '6',
  },
  {
    nameko: '5세대',
    name: 'Gen 5',
    url: '5',
  },
  {
    nameko: '4세대',
    name: 'Gen 4',
    url: '4',
  },
  {
    nameko: '3세대',
    name: 'Gen 3',
    url: '3',
  },
  {
    nameko: '2세대',
    name: 'Gen 2',
    url: '2',
  },
  {
    nameko: '1세대',
    name: 'Gen 1',
    url: '1',
  },
];

const typeOptionList = [
  {
    nameko: '포함',
    name: 'Includes',
    url: '',
  },
  {
    nameko: '4배',
    name: 'x4',
    url: 'eff__x4',
  },
  {
    nameko: '2배 이상',
    name: 'x2 or More',
    url: 'eff__x2',
  },
  {
    nameko: '1배 이상',
    name: 'x1 or More',
    url: 'eff__x1',
  },
  {
    nameko: '1배 이하',
    name: 'x1 or Less',
    url: 'eff__l1',
  },
  {
    nameko: '0.5배 이하',
    name: 'x0.5 or Less',
    url: 'eff__l2',
  },
  {
    nameko: '0.25배 이하',
    name: 'x0.25 or Less',
    url: 'eff__l4',
  },
  {
    nameko: '무효',
    name: 'Immune',
    url: 'eff__x0',
  },
];

const learnsetOptionList = [
  {
    nameko: '기술의 타입',
    name: 'Move Type',
    url: 'type=',
    next: 'type-list',
  },
  {
    nameko: '물리공격 기술',
    name: 'Physical Attack',
    url: 'category=Physical',
    next: 'option-append',
  },
  {
    nameko: '특수공격 기술',
    name: 'Special Attack',
    url: 'category=Special',
    next: 'option-append',
  },
  {
    nameko: '변화 기술',
    name: 'Status Move',
    url: 'category=Status',
    next: 'option-append',
  },
  {
    nameko: '명중률',
    name: 'Accuracy',
    url: 'accuracy=',
    next: 'number-input',
  },
  {
    nameko: '위력',
    name: 'Base Power',
    url: 'basepower=',
    next: 'number-input',
  },
  {
    nameko: 'PP',
    name: 'PP',
    url: 'pp=',
    next: 'number-input',
  },
  {
    nameko: '우선도',
    name: 'Priority',
    url: 'priority=',
    next: 'number-input',
  },
  {
    nameko: '다이맥스기술 위력',
    name: 'Max Move Power',
    url: 'maxmove=',
    next: 'number-input',
  },
  {
    nameko: 'Z기술 위력',
    name: 'Z-Move Power',
    url: 'zmove=',
    next: 'number-input',
  },
  {
    nameko: '절반 회복 기술',
    name: 'Heal Move',
    url: 'heal=50',
    next: 'option-append',
  },
  {
    nameko: '공격 랭크업 기술',
    name: 'Attack Boosting Move',
    url: 'boosts__atk=1..,target=self',
    next: 'option-append',
  },
  {
    nameko: '방어 랭크업 기술',
    name: 'Defense Boosting Move',
    url: 'boosts__def=1..,target=self',
    next: 'option-append',
  },
  {
    nameko: '특공 랭크업 기술',
    name: 'Sp. Atk Boosting Move',
    url: 'boosts__spa=1..,target=self',
    next: 'option-append',
  },
  {
    nameko: '특방 랭크업 기술',
    name: 'Sp. Def Boosting Move',
    url: 'boosts__spd=1..,target=self',
    next: 'option-append',
  },
  {
    nameko: '스피드 랭크업 기술',
    name: 'Speed Boosting Move',
    url: 'boosts__spe=1..,target=self',
    next: 'option-append',
  },
  {
    nameko: '일격 기술',
    name: 'OHKO Move',
    url: 'ohko=*',
    next: 'option-append',
  },
  {
    nameko: '다회 타격 기술',
    name: 'Multi-Hitting Move',
    url: 'multihit=*',
    next: 'option-append',
  },
];

const PokedexSearchBar = ({ dictionary, onInsert }) => {
  const [value, setValue] = useState('');

  const [pokedexFields, setPokedexFields] = useState([]);
  const [typesFields, setTypesFields] = useState([]);
  const [abilitiesFields, setAbilitiesFields] = useState([]);
  const [movesFields, setMovesFields] = useState([]);
  const [itemsFields, setItemsFields] = useState([]);
  const [eggGroupsFields, setEggGroupsFields] = useState([]);
  const [colorsFields, setColorsFields] = useState([]);
  const [optionsFields, setOptionsFields] = useState([]);

  const [operators, setOperators] = useState([]);
  const [learnsetTerms, setLearnsetTerms] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const [enableNumberInput, setEnableNumberInput] = useState(false);
  const [numberInput, setNumberInput] = useState('');

  const [learnsetOptions, setLearnsetOptions] = useState([]);
  const [learnsetFirstOption, setLearnsetFirstOption] = useState(null);
  const [learnsetNextOptions, setLearnsetNextOptions] = useState([]);
  const [enableLearnsetNumberInput, setEnableLearnsetNumberInput] =
    useState(false);
  const [learnsetNumberInput, setLearnsetNumberInput] = useState('');
  const [learnsetAppended, setLearnsetAppended] = useState([]);

  const [field, setField] = useState(null);
  const [option, setOption] = useState(null);
  const [term, setTerm] = useState(null);

  const onChange = useCallback(
    (e) => {
      setValue(e.target.value);
      setOperators([]);
      setLearnsetTerms([]);
      setTypeOptions([]);
      setLearnsetOptions([]);
      setLearnsetNextOptions([]);
      setEnableLearnsetNumberInput(false);
      setLearnsetNumberInput('');
      setLearnsetAppended([]);
      setEnableNumberInput(false);
      setNumberInput('');

      const filterDict = (option, string) =>
        dictionary
          .filter((item) => {
            if (string === '') return false;
            return (
              item.tag === option &&
              ((item.name
                ? item.name.toLowerCase().indexOf(string.toLowerCase()) > -1
                : false) ||
                (item.nameko
                  ? item.nameko.indexOf(string) > -1 ||
                    isSearch(string, item.nameko, true)
                  : false))
            );
          })
          .sort((a, b) => {
            if (
              a.name?.toLowerCase().startsWith(e.target.value) ||
              a.nameko?.startsWith(e.target.value)
            ) {
              return -1;
            } else return 0;
          });

      setPokedexFields(filterDict('pokedex', e.target.value));
      setTypesFields(filterDict('types', e.target.value));
      setAbilitiesFields(filterDict('abilities', e.target.value));
      setMovesFields(filterDict('moves', e.target.value));
      setItemsFields(filterDict('items', e.target.value));
      setEggGroupsFields(filterDict('egggroups', e.target.value));
      setColorsFields(filterDict('colors', e.target.value));
      setOptionsFields(filterDict('options', e.target.value));
    },
    [dictionary],
  );

  const clearAllFields = () => {
    setValue('');
    setPokedexFields([]);
    setTypesFields([]);
    setAbilitiesFields([]);
    setMovesFields([]);
    setItemsFields([]);
    setEggGroupsFields([]);
    setColorsFields([]);
    setOptionsFields([]);
  };

  const onClickNoOption = (event, field, item) => {
    clearAllFields();
    setField(field);
    setOption({ option: '', url: '' });
    setTerm({ term: item.nameko, url: item.name });
    setOperators(operatorList);
  };

  const onClickMove = (event, item) => {
    clearAllFields();
    setField({ field: '배우는 기술', url: 'learnset' });
    setOption({ option: item.nameko, url: item.index });
    setLearnsetTerms(learnsetTermList);
  };

  const onClickLearnsetTerm = (event, item) => {
    setTerm({ term: item.nameko, url: item.url });
    setLearnsetTerms([]);
    setOperators(operatorList);
  };

  const onClickType = (event, item) => {
    clearAllFields();
    setField({ field: '타입', url: 'types' });
    setTerm({ term: item.nameko, url: item.name });
    setTypeOptions(typeOptionList);
  };

  const onClickTypeOption = (event, item) => {
    setOption({ option: item.nameko, url: item.url });
    setTypeOptions([]);
    setOperators(operatorList);
  };

  const onClickOption = (event, item) => {
    clearAllFields();
    setField({ field: item.nameko, url: item.url });
    setOption({ option: '', url: '' });
    if (item.url === 'learnset__mult') {
      setLearnsetOptions(learnsetOptionList);
      return;
    }
    if (item.hasOwnProperty('term')) {
      setTerm({ term: '예', url: item.term });
    } else {
      setEnableNumberInput(true);
    }
    setOperators(operatorList);
  };

  const onClickLearnsetOption = useCallback(
    (event, item) => {
      if (item.next === 'option-append') {
        setLearnsetAppended((list) => list.concat(item));
      } else if (item.next === 'type-list') {
        setLearnsetOptions([]);
        setLearnsetFirstOption(item);
        setLearnsetNextOptions(
          dictionary.filter((item) => item.tag === 'types'),
        );
      } else if (item.next === 'number-input') {
        setLearnsetOptions([]);
        setLearnsetFirstOption(item);
        setEnableLearnsetNumberInput(true);
      }
    },
    [dictionary],
  );

  const onClickLearnsetNextOption = (event, item) => {
    if (learnsetFirstOption.next === 'type-list') {
      const newItem = {
        nameko: item.nameko + '타입 기술',
        name: item.name + '-Type Moves',
        url: 'type=' + item.name,
      };
      setLearnsetFirstOption(null);
      setLearnsetNextOptions([]);
      setLearnsetAppended((list) => list.concat(newItem));
      setLearnsetOptions(learnsetOptionList);
    }
  };

  const onClickLearnsetNumberSubmit = (event) => {
    const newItem = {
      nameko: learnsetFirstOption.nameko + ' "' + learnsetNumberInput + '"',
      name: learnsetFirstOption.name + ' "' + learnsetNumberInput + '"',
      url: learnsetFirstOption.url + learnsetNumberInput,
    };
    setLearnsetFirstOption(null);
    setEnableLearnsetNumberInput(false);
    setLearnsetNumberInput('');
    setLearnsetAppended((list) => list.concat(newItem));
    setLearnsetOptions(learnsetOptionList);
  };

  const onClickLearnsetAppended = (event, item) => {
    setLearnsetAppended((list) =>
      list.filter((appended) => appended.url !== item.url),
    );
  };

  const onClickLearnsetSubmit = (event) => {
    let field = '여러 개의 기술';
    let url = 'learnset__mult<';
    for (let appended of learnsetAppended) {
      field += ', ' + appended.nameko;
      url += appended.url + ',';
    }
    url += '>';
    setField({ field: field, url: url });
    setOption({ option: '', url: '' });
    setLearnsetOptions([]);
    setLearnsetNextOptions([]);
    setLearnsetAppended([]);
    setLearnsetTerms(learnsetTermList);
  };

  const clearAllSaved = () => {
    setEnableNumberInput(false);
    setNumberInput('');
    setOperators([]);
    setField(null);
    setOption(null);
    setTerm(null);
  };

  const onClickOperator = (event, item) => {
    let operatorObj;
    if (item.name === 'AND') {
      operatorObj = { operator: '&', url: '%2B' };
    }
    if (item.name === 'OR') {
      operatorObj = { operator: '|', url: '|' };
    }
    if (item.name === 'NOT') {
      operatorObj = { operator: '-', url: '%7E' };
    }
    if (enableNumberInput) {
      const termObj = { term: numberInput, url: numberInput };
      onInsert(operatorObj, field, option, termObj);
    } else {
      onInsert(operatorObj, field, option, term);
    }
    clearAllSaved();
  };

  return (
    <>
      <div className="SearchBar">
        <input
          placeholder="검색어를 입력하세요"
          value={value}
          onChange={onChange}
        />
        <div className="fields">
          <OptionField
            fields={pokedexFields}
            name="포켓몬"
            onClick={(event, item) =>
              onClickNoOption(event, { field: '이름', url: '' }, item)
            }
          />
          <OptionField
            fields={abilitiesFields}
            name="특성"
            onClick={(event, item) =>
              onClickNoOption(event, { field: '특성', url: 'abilities' }, item)
            }
          />
          <OptionField fields={movesFields} name="기술" onClick={onClickMove} />
          <OptionField fields={typesFields} name="타입" onClick={onClickType} />
          <OptionField
            fields={colorsFields}
            name="색상"
            onClick={(event, item) =>
              onClickNoOption(event, { field: '색상', url: 'color' }, item)
            }
          />
          <OptionField
            fields={eggGroupsFields}
            name="알 그룹"
            onClick={(event, item) =>
              onClickNoOption(
                event,
                { field: '알 그룹', url: 'egggroups' },
                item,
              )
            }
          />
          <OptionField
            fields={optionsFields}
            name="검색 옵션"
            onClick={onClickOption}
          />
          <OptionField
            fields={learnsetNextOptions}
            name="여러 개의 기술 검색 옵션: 계속"
            onClick={onClickLearnsetNextOption}
          />
          {enableLearnsetNumberInput ? (
            <>
              <input
                placeholder="숫자 입력! 점 두 개(..)로 범위를 나타낼 수 있어요"
                value={learnsetNumberInput}
                onChange={(e) => setLearnsetNumberInput(e.target.value)}
              />
              <div
                className="learnset-submit"
                onClick={onClickLearnsetNumberSubmit}
              >
                숫자 입력 확정하기
              </div>
            </>
          ) : null}
          <OptionField
            fields={learnsetOptions}
            name="여러 개의 기술 검색 옵션"
            onClick={onClickLearnsetOption}
          />
          <OptionField
            fields={learnsetAppended}
            name="활성화된 기술 검색 옵션"
            onClick={onClickLearnsetAppended}
          />
          <OptionField
            fields={learnsetTerms}
            name="기술을 배우는 세대"
            onClick={onClickLearnsetTerm}
          />
          {learnsetAppended.length ? (
            <div className="learnset-submit" onClick={onClickLearnsetSubmit}>
              이 기술 조합으로 검색하기
            </div>
          ) : null}
          <OptionField
            fields={typeOptions}
            name="타입 검색 옵션"
            onClick={onClickTypeOption}
          />
          {enableNumberInput ? (
            <input
              placeholder="숫자 입력! 점 두 개(..)로 범위를 나타낼 수 있어요"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
            />
          ) : null}
          <OptionField
            fields={operators}
            name="가능한 옵션"
            onClick={onClickOperator}
          />
        </div>
      </div>
    </>
  );
};

export default PokedexSearchBar;
