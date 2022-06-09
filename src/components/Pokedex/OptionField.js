import './OptionField.scss';

const OptionField = ({ fields, name, onClick }) => {
  if (!fields || !fields.length) return;
  return (
    <>
      <div className="field-name">{name}</div>
      {fields.map((item, index) => (
        <div
          className="field-select"
          key={index}
          onClick={(event) => onClick(event, item)}
        >
          {item.nameko}
        </div>
      ))}
    </>
  );
};

export default OptionField;
