const PokedexSearchOptionFieldSelectSecondary = ({ optionDict, option }) => {
  return <option value={option}>{optionDict[option].ko}</option>;
};

export default PokedexSearchOptionFieldSelectSecondary;
