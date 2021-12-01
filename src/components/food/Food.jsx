import './styles.css';

const Food = ({ position }) => {
  return (
    <div className="food" style={{ left: `${position[0]}%`, top: `${position[1]}%` }} />
  );
};

export default Food;