import './styles.css';

const SnakeBlock = ({ position }) => {
  return (
    <div className="snakeBlock" style={{ left: `${position[0]}%`, top: `${position[1]}%` }} />
  );
};

export default SnakeBlock;