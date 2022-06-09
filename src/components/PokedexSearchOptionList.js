import React from 'react';
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

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div className="tip">검색 옵션 (순서를 드래그해서 바꿀 수 있어요!)</div>
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
      <div className="tip">검색 결과</div>
    </DndProvider>
  );
};

export default React.memo(PokedexSearchOptionList);
