import './PokemonIcon.scss';

const PokemonIcon = ({ num, iconfilename }) => {
  let src = '/icon/';
  if (iconfilename === null) {
    src += '000';
  } else if (iconfilename !== '') {
    src += iconfilename;
  } else {
    src += num;
  }
  src += '.png';

  return (
    <div className="PokemonIcon">
      <img src={src} />
    </div>
  );
};

export default PokemonIcon;
