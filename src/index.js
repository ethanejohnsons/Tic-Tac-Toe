import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';

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
     * Render the board to the screen. Contains calls to logic such as
     * calculating the winner and deciding which player goes next.
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
        };
    }

    /**
     * Handles whenever the user clicks on a {@link Square}. Also makes a
     * copy of the square array in order to avoid mutation.
     * @param {String} i 
     */
    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        /* If the game was already won or if that square was already clicked */
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        
        /* Set the square's value to X or O. */
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{ // concat method doesn't mutate original array
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }

    /**
     * Responsible for rendering the entire game including the 
     * status message, the winner message, the history, etc.
     */
    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
    
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

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