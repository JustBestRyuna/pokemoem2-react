import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MdRemoveCircleOutline } from 'react-icons/md';
import './PokedexSearchOptionItem.scss';

const PokedexSearchOptionItem = ({
  option,
  index,
  moveItem,
  onRemove,
  setDragging,
}) => {
  const { id, operator, field, term } = option;

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'OPTIONITEM',
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        setDragging(false);
      },
    }),
    [id, index, moveItem],
  );

  const [_, drop] = useDrop(
    () => ({
      accept: 'OPTIONITEM',
      hover: ({ id: draggedId }) => {
        if (draggedId !== id) {
          moveItem(draggedId, index);
        }
      },
    }),
    [id, index, moveItem],
  );

  return (
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="PokedexSearchOptionItem" ref={(ref) => drag(drop(ref))}>
        <div className="operator">{operator}</div>
        <div className="option-field">
          <div className="text">{field}:</div>
        </div>
        <div className="option-term">
          <div className="text">{term}</div>
        </div>
        <div className="remove" onClick={() => onRemove(id)}>
          <MdRemoveCircleOutline />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PokedexSearchOptionItem);
