import SnakeBlock from "../snake-block/SnakeBlock";
import { getRandomCanvasCoordinate } from '../../utils/mainUtils';

const Snake = ({ state }) => {
  return (
    <div>
      {
        state.map(
          (blockPosition) => (
            <SnakeBlock
              key={`${blockPosition[0]}${blockPosition[1]}_x_${getRandomCanvasCoordinate()[0]}_y_${getRandomCanvasCoordinate()[1]}`}
              position={blockPosition}
            />
          )
        )
      }
    </div>
  );
};

export default Snake;