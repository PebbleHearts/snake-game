import { useEffect, useReducer, useRef } from 'react';

import './App.css';
import Food from './components/food/Food';
import Snake from './components/snake/Snake';
import { getRandomCanvasCoordinate } from './utils/mainUtils';

const actionTypes = {
  GAME_STARTED: 'GAME_STARTED',
  MOVE_SNAKE: 'MOVE_SNAKE',
  CHANGE_DIRECTION: 'CHANGE_DIRECTION',
  EAT_FOOD: 'EAT_FOOD',
  GAME_OVER: 'GAME_OVER',
  RESET_GAME: 'RESET_GAME'
}

const directionTypes = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN',
};

const keyToDirectionMapping = {
  ArrowRight: directionTypes.RIGHT,
  ArrowLeft: directionTypes.LEFT,
  ArrowUp: directionTypes.UP,
  ArrowDown: directionTypes.DOWN
}

const possibleDirectionChanges = {
  [directionTypes.RIGHT]: [directionTypes.UP, directionTypes.DOWN],
  [directionTypes.LEFT]: [directionTypes.UP, directionTypes.DOWN],
  [directionTypes.UP]: [directionTypes.RIGHT, directionTypes.LEFT],
  [directionTypes.DOWN]: [directionTypes.RIGHT, directionTypes.LEFT],
}

const getNextHead = (state) => {
  const snakeLength = state.snake.length;
  const lastHead = state.snake[snakeLength - 1];
  const lastHeadXPosition = lastHead[0];
  const lastHeadYPosition = lastHead[1];
  let newHead = [];
  switch(state.direction) {
    case directionTypes.RIGHT:
      newHead = [(lastHeadXPosition + 2) % 100, lastHeadYPosition]
      break;
    case directionTypes.LEFT:
      const newXPosition = lastHeadXPosition === 0 ? 98 : lastHeadXPosition - 2;
      newHead = [newXPosition, lastHeadYPosition];
      break
    case directionTypes.UP:
      const newYPosition = lastHeadYPosition === 0 ? 98 : lastHeadYPosition - 2;
      newHead = [lastHeadXPosition, newYPosition];
      break;
    case directionTypes.DOWN:
      newHead = [lastHeadXPosition, (lastHeadYPosition  + 2) % 100];
      break;
    default: 
      break;
  }

  return newHead;
};

const gameStateReducer = (state, action) => {
  switch(action.type) {
    case actionTypes.GAME_STARTED:
      return { ...initialState, gameStarted: true };
    case actionTypes.MOVE_SNAKE: {
      const newHead = getNextHead(state);
      const movedSnake = [...state.snake, newHead];
      movedSnake.shift();
      return { ...state, snake: movedSnake };
    }
    case actionTypes.CHANGE_DIRECTION: {
      const canChangeDirection = possibleDirectionChanges[state.direction].includes(action.payload)
      return canChangeDirection ? { ...state, direction: action.payload } : state;
    }
    case actionTypes.EAT_FOOD: {
      const newHead = getNextHead(state);
      const snakeWithEatenFood = [...state.snake, newHead];
      return { ...state, snake: snakeWithEatenFood, food: getRandomCanvasCoordinate(), score: state.score + 1 }
    }
    case actionTypes.GAME_OVER:
      return { ...state, isGameOver: true }
    case actionTypes.RESET_GAME:
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  gameStarted: false,
  isGameOver: false,
  snake: [[0, 0], [2, 0]],
  food: getRandomCanvasCoordinate(),
  direction: directionTypes.RIGHT,
  score: 0
}

function App() {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialState);
  const timerRef = useRef(null);

  const startGame = () => {
    dispatch({ type: actionTypes.GAME_STARTED });
    timerRef.current = setInterval(() => {
      dispatch({ type: actionTypes.MOVE_SNAKE })
    }, 200);
  };

  useEffect(() => {
    window.addEventListener('keydown', e => {
      dispatch(
        {
          type: actionTypes.CHANGE_DIRECTION,
          payload: keyToDirectionMapping[e.key]
        }
      );
    });
  }, []);

  useEffect(() => {
    const snakeLength = gameState.snake.length;
    const snakeHead = gameState.snake[snakeLength - 1];
    const foodPosition = gameState.food;
    if (snakeHead[0] === foodPosition[0] && snakeHead[1] === foodPosition[1]) {
      dispatch({ type: actionTypes.EAT_FOOD });
    }

    const hasTouchedSnakesBody = gameState.snake.findIndex((snakeBlock, index) => {
      return index !== snakeLength - 1 && snakeBlock[0] === snakeHead[0] && snakeBlock[1] === snakeHead[1] 
    });

    if (hasTouchedSnakesBody !== -1) {
      clearInterval(timerRef.current);
      dispatch({ type: actionTypes.GAME_OVER });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.snake]);

  return (
    <div className="App">
      {
        !gameState.gameStarted || gameState.isGameOver ? (
          <div className="overlay">
            {gameState.isGameOver && (
              <>
                <h4 className="scoreText">Score: {gameState.score}</h4>
                <h2>Game Over</h2>
              </>
            )}
            <button onClick={startGame} className="overlayStartButton">Start Game</button>
          </div>
        ) : null
      }
      <div className="maze">
        <Snake state={gameState.snake} />
        <Food position={gameState.food} />
      </div>
    </div>
  );
}

export default App;
