import { useState, useEffect } from 'react'
import Button from './components/Button/Button'
import { io } from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:3000', { autoConnect: false });

function App() {
  const [playerSign, setPlayerSign] = useState(null);
  const [currentSign, setCurrentSign] = useState('X');
  const [ready, setReady] = useState(false);
  const [winner, setWinner] = useState(null);
  const [cellSign, setCellSign] = useState(
    Object.fromEntries(Array.from({ length: 9 }, (_, i) => [String(i + 1), '']))
  );

  useEffect(() => {
    function updateBoard({ board, nextSign, ready, winner }) {
      setCellSign(board);
      setCurrentSign(nextSign);
      setReady(ready);
      setWinner(winner);
    }
    function disconnect() {
      setPlayerSign(null);
      setReady(false);
    }
    function refreshGame() {
      window.location.reload();
    }
    socket.on('playerSign', setPlayerSign);
    socket.on('updateBoard', updateBoard);
    socket.on('disconnect', disconnect);
    socket.on('refreshGame', refreshGame);
    socket.connect();

    return () => {
      socket.off('playerSign', setPlayerSign);
      socket.off('updateBoard', updateBoard);
      socket.off('disconnect', disconnect);
      socket.off('refreshGame', refreshGame);
      socket.disconnect();
    };
  }, []);

  const canPlay = ready && playerSign === currentSign && !winner;

  function handleClick(id) {
    if (!socket.connected || !canPlay || cellSign[id]) return;
    socket.emit('makeMove', id);
  }

  let status = 'Waiting for another player…';
  if (winner) status = `${winner === 'draw' ? 'Draw!' : `${winner} wins!`} Refreshing in 5 seconds…`;
  else if (ready && !playerSign) status = 'You are spectating.';
  else if (ready) status = canPlay ? 'Your turn.' : 'Waiting for the other player…';

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <p role="status">{playerSign && `You are ${playerSign}. `}{status}</p>
      <div className="board">
        {Object.keys(cellSign).map(id => (
          <Button
            key={id}
            id={id}
            sign={cellSign[id]}
            disabled={!canPlay || Boolean(cellSign[id])}
            onClick={() => handleClick(id)}
          />
        ))}
      </div>
    </>
  );
}

export default App
