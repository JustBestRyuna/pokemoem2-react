const PokedexSearchOptionFieldSelect = ({ fieldsDict, field, onChange }) => {
  return (
    <select className="operator-search" value={field} onChange={onChange}>
      {Object.entries(fieldsDict).map(([key, value]) => (
        <option value={key} key={key}>
          {value.ko}
        </option>
      ))}
    </select>
  );
};

export default PokedexSearchOptionFieldSelect;
