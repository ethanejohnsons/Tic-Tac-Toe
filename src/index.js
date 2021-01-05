import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';

/**
 * The object definition for the board rendered to the screen.
 */
class Board extends React.Component {
    /**
     * Render each square to the screen.
     * @param {Number} i 
     */
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    /**
     * Render the board to the screen.
     */
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

/**
 * The Game class that acts as the container 
 * for all the other classes in this file.
 */
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
        };
    }

    /**
     * Handles whenever the user clicks on a {@link Square}. Also makes a
     * copy of the square array in order to avoid mutation.
     * @param {Number} i 
     */
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        /* If the game was already won or if that square was already clicked */
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        /* Set the square's value to X */
        squares[i] = 'X';
        this.setState({
            history: history.concat([{ // concat method doesn't mutate original array
                squares: squares,
            }]),
            stepNumber: history.length,
        });

        /* Calculate the computer's move */
        i = calculateNextMove(squares);

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        /* Sets the square's value to O */
        squares[i] = 'O';
        this.setState({
            history: history.concat([{ // concat method doesn't mutate original array
                squares: squares,
            }]),
            stepNumber: history.length,
        });
    }

    /**
     * Jump to a specific state in the history array
     * @param {Number} step 
     */
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            // xIsNext: (step % 2) === 0,
        });
    }

    /**
     * Responsible for rendering the entire game including the 
     * status message, the winner message, the history, etc.
     */
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        /* Determine if the game has been won */
        let status = '';
        if (winner) {
            status = 'Winner: ' + winner;
        }
    
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

/**
 * The {@link Square} function used by React. Could've also been a class
 * like {@link Board} but it was simpler to create a function instead.
 * @param {*} props the properties array used by react
 * @see Board
 */
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/**
 * ARTIFICIAL INTELLIGENCE, MAN!!!
 * real slo mode
 * @param {Array} squares 
 */
function calculateNextMove(squares) {
    /* Winning lines */
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    /* Top precedence */
    for (let i = 0; i < lines.length; i++) {
        /* Two "in a row" */
        if (squares[lines[i][0]] == 'O' && squares[lines[i][1]] == 'O' && squares[lines[i][2]] == null) {
            return lines[i][2];
        } else if (squares[lines[i][0]] == 'O' && squares[lines[i][1]] == null && squares[lines[i][2]] == 'O') {
            return lines[i][1];
        } else if (squares[lines[i][0]] == null && squares[lines[i][1]] == 'O' && squares[lines[i][2]] == 'O') {
            return lines[i][0];
        }
    }

    /* Second precedence */
    for (let i = 0; i < lines.length; i++) {
        /* Block the user */
        if (squares[lines[i][0]] == 'X' && squares[lines[i][1]] == 'X' && squares[lines[i][2]] == null) {
            return lines[i][2];
        } else if (squares[lines[i][0]] == 'X' && squares[lines[i][1]] == null && squares[lines[i][2]] == 'X') {
            return lines[i][1];
        } else if (squares[lines[i][0]] == null && squares[lines[i][1]] == 'X' && squares[lines[i][2]] == 'X') {
            return lines[i][0];
        }
    }

    /* Third precedence */
    for (let i = 0; i < lines.length; i++) {
        /* One next to nothing */
        if (squares[lines[i][0]] == 'O' && squares[lines[i][1]] == null && squares[lines[i][2]] == null) {
            return lines[i][2];
        } else if (squares[lines[i][0]] == null && squares[lines[i][1]] == null && squares[lines[i][2]] == 'O') {
            return lines[i][0];
        } else if (squares[lines[i][0]] == null && squares[lines[i][1]] == 'O' && squares[lines[i][2]] == null) {
            return lines[i][0];
        }
    }

    /* Else, just get the next empty space */
    return getEmptySpace(squares);
}

/**
 * Returns the index for an open space on the board.
 * @param {Array} squares 
 */
function getEmptySpace(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] == null) {
            return i;
        }
    }
}


/**
 * Straight up copy and pasted from the tutorial, calculates
 * who the winner is (if there even is a winner).
 */
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);