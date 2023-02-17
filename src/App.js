import React from 'react';
import { useState } from 'react';

function Square({ value, onSquareClick }) {
        return <button className="square" onClick={onSquareClick}>{value}</button>; //could just return this tag directly in renderBoard logic...
}

function Board({ xIsNext, squares, onPlay }) {

        function handleClick(i) {
                if (squares[i] || calculateWinner(squares)) {
                        return;
                }
                const nextSquares = squares.slice();
                if (xIsNext) {
                        nextSquares[i] = "X"
                } else {
                        nextSquares[i] = "O"
                }
                onPlay(nextSquares);
        }

        function renderBoard(size) {
                const board = [];
                for (let i = 0; i < size; i++) {
                        let row = [];
                        for (let j = 0; j < size; j++) {
                                row.push(<Square key={i * size + j} value={squares[i * size + j]} onSquareClick={() => handleClick(i * size + j)} />);
                        }
                        board.push(
                                <div key={i} className="board-row">
                                        {row}
                                </div>
                        )
                }
                return board;
        }

        const winner = calculateWinner(squares);
        let status;
        if (winner) {
                status = 'Winner: ' + winner;
        } else {
                status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }

        return (
                <div>
                        <div className='status'>{status}</div>
                        {renderBoard(3)}
                </div>
        );
}

export default function Game() {
        function handlePlay(nextSquares) {
                const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
                setHistory(nextHistory);
                setCurrentMove(nextHistory.length - 1);
        }

        function jumpTo(nextMove) {
                setCurrentMove(nextMove);
        }

        const [history, setHistory] = useState([Array(9).fill(null)]);
        const [currentMove, setCurrentMove] = useState(0);
        const xIsNext = currentMove % 2 === 0;
        const currentSquares = history[currentMove];
        const moves = history.map((squares, move) => {
                let description;
                if (move > 0) {
                        description = 'Go to move #' + move;
                } else {
                        description = 'Go to game start';
                }
                return (
                        <li key={move}>
                                <button onClick={() => jumpTo(move)}>{description}</button>
                        </li>
                );
        });

        return (
                <div className="game">
                        <div className="game-board">
                                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                        </div>
                        <div className="game-info">
                                <ol>{moves}</ol>
                        </div>
                </div>
        );
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
                [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i];
                if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                        return squares[a];
                }
        }
        return null;
}
