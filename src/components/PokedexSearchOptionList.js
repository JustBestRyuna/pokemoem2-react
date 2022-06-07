import React, { useState } from 'react';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import PokedexSearchOptionItem from './PokedexSearchOptionItem';
import './PokedexSearchOptionList.scss';

const PokedexSearchOptionList = ({
  options,
  setOptions,
  setDragging,
  onRemove,
}) => {
  const moveItem = (id, hoverIndex) => {
    const dragIndex = options.findIndex((item) => item.id === id);
    if (dragIndex < 0) return;
    const item = options[dragIndex];
    const newOptions = [...options];
    newOptions.splice(dragIndex, 1);
    newOptions.splice(hoverIndex, 0, item);
    setDragging(true);
    setOptions(newOptions);
  };

  const [openTip, setOpenTip] = useState(false);

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div className="PokedexSearchOptionList">
        {options.map((option, index) => (
          <PokedexSearchOptionItem
            option={option}
            key={option.id}
            index={index}
            moveItem={moveItem}
            onRemove={onRemove}
            setDragging={setDragging}
          />
        ))}
      </div>
      <div className="tip" onClick={() => setOpenTip(!openTip)}>
        {openTip ? (
          <>
            검색 옵션은 크게 '연산자' '필드' '검색어'로 나뉘어요.
            <br />
            연산자는 &과 |, -가 있어요.
            <br />
            &는 '지금까지 검색한 것 중에서 ~를 검색해라!'는 뜻이에요.
            <br />
            |는 '지금까지 검색한 것과 함께 ~도 검색해라!'는 뜻이에요.
            <br />
            -는 '지금까지 검색한 것 중에서 ~는 빼라!'는 뜻이에요.
            <br />
            필드와 검색어는 직접 목록을 클릭하면서 위에 노란색으로 나타나는 팁을
            읽어보시는 게 빠를 거예요!
            <br />
            검색 옵션을 + 버튼이나 엔터 키를 사용해서 넣으면, 곧 검색 결과가
            바뀔 거예요.
            <br />
            검색 옵션들의 순서를 드래그해서 바꿀 수도 있어요!
          </>
        ) : (
          <>어떻게 사용할지 잘 모르겠나요? 눌러서 팁을 읽어보세요!</>
        )}
      </div>
    </DndProvider>
  );
};

export default React.memo(PokedexSearchOptionList);
