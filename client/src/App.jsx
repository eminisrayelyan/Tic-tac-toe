import { useState, useEffect } from 'react'
import Button from './components/Button/Button'
import { io } from "socket.io-client";
import './App.css'

const socket = io("http://localhost:3000");

let unactives = {};

let currentCombs = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9']
]

function App() {
  const [currentSign, setCurrentSign] = useState('X');
  const [cellSign, setCellSign] = useState({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
  });

    useEffect(() => {
      socket.on('updateBoard', ( data ) => {
          if (!data) {
            return;
          };
          const { board, nextSign } = data;
          setCellSign(board);
          setCurrentSign(nextSign);
      });

      return () => socket.off('updateBoard');
    },[]);

  function handleClick (e, id) {  
    if (!unactives[e.target.id]) {
      e.target.innerText = currentSign; 
      cellSign[id] = currentSign;
      const updateCellSign = {...cellSign, [id]: currentSign}

      setCellSign(updateCellSign)

      console.log(cellSign)

      unactives[e.target.id] = true;

      for (let i = 0; i < currentCombs.length; i++) {
        for (let j = 0; j < currentCombs.length; j++) {
            if(currentCombs[i][j] === e.target.id) {
              currentCombs[i][j] = currentSign;
            }
        }
      }
      
      console.log(currentCombs)
      
      if (currentSign === 'X') {
        setCurrentSign('O');
      } else {  
        setCurrentSign('X');
      }
    }

    socket.emit('updateBoard', {
      'board': cellSign,
      'nextSign': currentSign === 'X' ? 'O' : 'X'
    });

    checkWin();
  }

  function checkWin() {
    for(let currentComb of currentCombs) {
      let pos1val1 = currentComb[0];
      let pos1val2 = currentComb[1];
      let pos1val3 = currentComb[2];

      console.log(pos1val1, pos1val2, pos1val3)

      if(pos1val1 === pos1val2 && pos1val2 === pos1val3) {
        alert("win")
        window.location.reload(false);
      } 
    }

    for(let i = 0; i < currentCombs.length; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentCombs[i][j] === currentCombs[i + 1][j] && 
          currentCombs[i + 1][j] === currentCombs[i + 2][j]) {
            alert("win");
            window.location.reload(false);
          } else {
            continue;
          }
      }
      break;
    }

    if ( (currentCombs[0][0] === currentCombs[1][1] && 
          currentCombs[1][1] === currentCombs[2][2]) || 
          (currentCombs[0][2] === currentCombs[1][1] &&
          currentCombs[1][1] === currentCombs[2][0]) ) {
              alert("win");
              window.location.reload(false);
    } 

  if ( (currentCombs[0][2] === currentCombs[1][1] && 
        currentCombs[1][1] === currentCombs[2][2]) || 
        (currentCombs[0][3] === currentCombs[1][2] &&
        currentCombs[1][2] === currentCombs[2][2]) ) {
          alert("win");
          window.location.reload(false);
  }
}   

  return (
    <div className='board'>
          {Object.keys(cellSign).map((id) => (
            <Button
              key={id}
              id={parseInt(id)}
              sign={cellSign[id]} 
              onClick={e => handleClick(e, id)}
            />
          ))}
    </div>
  )
}

export default App