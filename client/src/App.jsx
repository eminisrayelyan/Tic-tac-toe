import { useState } from 'react'
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
  

  
  function handleClick (e) {  
    if (!unactives[e.target.id]) {
      e.target.innerText = currentSign;
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
      (currentCombs[0][3] === currentCombs[1][2] &&
        currentCombs[1][2] === currentCombs[2][2]) ) {
        alert("win");
        window.location.reload(false);
  }
}   

  return (
    <div className='board'>
      <div className='boardColumn'>
          <Button 
            id={1}
            onClick={handleClick}
          />
          <Button 
            id = {4}
            onClick={handleClick}
          />
          <Button 
            id = {7}
            onClick={handleClick}
          />
      </div>
      <div className='boardColumn'>
          <Button 
            id = {2}
            onClick={handleClick}
          />
          <Button 
            id = {5} 
            onClick={handleClick}
          />
          <Button 
            id = {8}
            onClick={handleClick}  
          />
      </div>
      <div className='boardColumn'>
          <Button 
            id = {3}
            onClick={handleClick}
          />
          <Button 
            id = {6}
            onClick={handleClick}
          />
          <Button 
            id = {9}
            onClick={handleClick}
          />
      </div>
    </div>
  )
}

export default App
