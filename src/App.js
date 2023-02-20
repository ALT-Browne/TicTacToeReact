import React from 'react';
import { useState } from 'react';

function Square({ value, winningSquare, onSquareClick }) {
        return <button className={winningSquare ? "winning-square" : "square"} onClick={onSquareClick}>{value}</button>; //could just return this tag directly in renderBoard logic...
}

function Board({ xIsNext, squares, onPlay }) {

        function handleClick(i) {
                if (squares[i] || calculateWinner(squares)[0]) {
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

        function renderBoard(winner) {
                const board = [];
                for (let i = 0; i < 3; i++) {
                        let row = [];
                        for (let j = 0; j < 3; j++) {
                                row.push(<Square key={i * 3 + j} value={squares[i * 3 + j]} winningSquare={winner[0] && winner[1].some(rowCol => rowCol[0] === i && rowCol[1] === j) ? true : false} onSquareClick={() => handleClick(i * 3 + j)} />);
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
        if (winner[0]) {
                status = 'Winner: ' + winner[0];
        } else {
                status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        if (squares.every(value => value != null) && !winner[0]) {
                status = "Draw"
        }

        return (
                <div>
                        <div className='status'>{status}</div>
                        {renderBoard(winner)}
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

        function changeMovesOrder() {
                setMovesIsAscending(!movesIsAscending);
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
        const [movesIsAscending, setMovesIsAscending] = useState(true);

        return (
                <div className="game">
                        <div className="game-board">
                                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                        </div>
                        <div className="game-info">
                                <button onClick={() => changeMovesOrder()}>{movesIsAscending ? "Descending" : "Ascending"}</button>
                                <ol>{movesIsAscending ? moves : moves.reverse()}</ol>
                        </div>
                </div>
        );
}

function calculateWinner(squares) {
        const lines = [
                [[0, 1, 2], [[0, 0], [0, 1], [0, 2]]],
                [[3, 4, 5], [[1, 0], [1, 1], [1, 2]]],
                [[6, 7, 8], [[2, 0], [2, 1], [2, 2]]],
                [[0, 3, 6], [[0, 0], [1, 0], [2, 0]]],
                [[1, 4, 7], [[0, 1], [1, 1], [2, 1]]],
                [[2, 5, 8], [[0, 2], [1, 2], [2, 2]]],
                [[0, 4, 8], [[0, 0], [1, 1], [2, 2]]],
                [[2, 4, 6], [[0, 2], [1, 1], [2, 0]]]
        ];
        for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i][0];
                if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                        return [squares[a], lines[i][1]];
                }
        }
        return [null, null];
}
