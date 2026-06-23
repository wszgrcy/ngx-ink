import { Component, signal, computed, OnDestroy } from '@angular/core';
import { BoxComponent, TextComponent } from '@cyia/ngx-lib';
import { useInput, useApp, useWindowSize } from '@cyia/ngx-lib';

type Point = {
    x: number;
    y: number;
};

type Direction = 'up' | 'down' | 'left' | 'right';

type GameState = {
    snake: Point[];
    food: Point;
    score: number;
    gameOver: boolean;
    won: boolean;
    frame: number;
};

type Action = { type: 'tick'; direction: Direction } | { type: 'restart' };

const headCharacter = '🦄';
const bodyCharacter = '✨';
const foodCharacter = '🌈';
const emptyCell = '  ';
const tickMs = 150;

const boardWidth = 20;
const boardHeight = 15;

const opposites: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
};

const offsets: Record<Direction, Point> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
};

const rainbowColors = ['red', '#FF7F00', 'yellow', 'green', 'cyan', 'blue', 'magenta'] as const;

const borderH = '─'.repeat(boardWidth * 2);
const borderTop = `┌${borderH}┐`;
const borderBottom = `└${borderH}┘`;
const boardWidthChars = boardWidth * 2 + 2;

const initialSnake: Point[] = [
    { x: 10, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 7 },
];

function randomPosition(exclude: Point[]): Point {
    let point = {
        x: 0,
        y: 0,
    };
    let isExcluded = true;

    while (isExcluded) {
        point = {
            x: Math.floor(Math.random() * boardWidth),
            y: Math.floor(Math.random() * boardHeight),
        };

        isExcluded = false;
        for (const segment of exclude) {
            if (segment.x === point.x && segment.y === point.y) {
                isExcluded = true;
                break;
            }
        }
    }

    return point;
}

function createInitialState(): GameState {
    return {
        snake: initialSnake,
        food: randomPosition(initialSnake),
        score: 0,
        gameOver: false,
        won: false,
        frame: 0,
    };
}

export function gameReducer(state: GameState, action: Action): GameState {
    if (action.type === 'restart') {
        return createInitialState();
    }

    if (state.gameOver) {
        return state;
    }

    const head = state.snake[0]!;
    const offset = offsets[action.direction];
    const newHead: Point = { x: head.x + offset.x, y: head.y + offset.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= boardWidth || newHead.y < 0 || newHead.y >= boardHeight) {
        return { ...state, gameOver: true, won: false };
    }

    const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;
    const collisionSegments = ateFood ? state.snake : state.snake.slice(0, -1);

    if (collisionSegments.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...state, gameOver: true, won: false };
    }

    const newSnake = [newHead, ...state.snake];

    if (!ateFood) {
        newSnake.pop();
    }

    if (ateFood && newSnake.length === boardWidth * boardHeight) {
        return {
            snake: newSnake,
            food: state.food,
            score: state.score + 1,
            gameOver: true,
            won: true,
            frame: state.frame + 1,
        };
    }

    return {
        snake: newSnake,
        food: ateFood ? randomPosition(newSnake) : state.food,
        score: state.score + (ateFood ? 1 : 0),
        gameOver: false,
        won: false,
        frame: state.frame + 1,
    };
}

function buildBoard(snake: Point[], food: Point): string {
    const headKey = `${snake[0]!.x},${snake[0]!.y}`;
    const snakeSet = new Set(snake.map((segment) => `${segment.x},${segment.y}`));

    const rows: string[] = [borderTop];
    for (let y = 0; y < boardHeight; y++) {
        let row = '│';
        for (let x = 0; x < boardWidth; x++) {
            const key = `${x},${y}`;
            if (key === headKey) {
                row += headCharacter;
            } else if (snakeSet.has(key)) {
                row += bodyCharacter;
            } else if (food.x === x && food.y === y) {
                row += foodCharacter;
            } else {
                row += emptyCell;
            }
        }

        row += '│';
        rows.push(row);
    }

    rows.push(borderBottom);
    return rows.join('\n');
}

@Component({
    selector: 'ink-alternate-screen-example',
    standalone: true,
    imports: [BoxComponent, TextComponent],
    templateUrl: './alternate-screen-example.component.html',
})
export class AlternateScreenExampleComponent implements OnDestroy {
    private readonly app = useApp();
    private readonly windowSize = useWindowSize();

    // Game state using signal (equivalent to React's useReducer)
    game = signal<GameState>(createInitialState());
    // Direction reference (equivalent to React's useRef<Direction>)
    directionRef = 'right' as Direction;

    private timer: ReturnType<typeof setInterval> | undefined;

    constructor() {
        // Game tick interval (equivalent to useEffect with setInterval)
        this.timer = setInterval(() => {
            this.tick();
        }, tickMs);

        useInput((input, key) => {
            const currentGame = this.game();

            if (input === 'q') {
                this.app().exit();
            }

            if (currentGame.gameOver && input === 'r') {
                this.directionRef = 'right';
                this.game.set(createInitialState());
                return;
            }

            if (currentGame.gameOver) {
                return;
            }

            const { current } = { current: this.directionRef };
            if (key.upArrow && current !== 'down') {
                this.directionRef = 'up';
            } else if (key.downArrow && current !== 'up') {
                this.directionRef = 'down';
            } else if (key.leftArrow && current !== 'right') {
                this.directionRef = 'left';
            } else if (key.rightArrow && current !== 'left') {
                this.directionRef = 'right';
            }
        });
    }

    // tick() dispatches to gameReducer (equivalent to React's dispatch({type: 'tick', direction}))
    private tick() {
        const currentGame = this.game();
        const action: Action = { type: 'tick', direction: this.directionRef };
        this.game.set(gameReducer(currentGame, action));
    }

    // Derived values (equivalent to computed values in the render function)
    readonly titleColor = computed(() => {
        const frame = this.game().frame;
        return rainbowColors[frame % rainbowColors.length]!;
    });

    readonly board = computed(() => {
        const game = this.game();
        return buildBoard(game.snake, game.food);
    });

    readonly marginLeft = computed(() => {
        const columns = this.windowSize().columns;
        return Math.max(Math.floor((columns - boardWidthChars) / 2), 0);
    });

    getFoodCharacter(): string {
        return foodCharacter;
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
