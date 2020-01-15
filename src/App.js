import React, {useState} from 'react';
import './App.css';
import Cell from './Cell'
import Container from './Container'
import ActionBar from './ActionBar'
import generateMinefield from './functions/generateMinefield'

function App() {
  const [state, setState] = useState({
    gameOn: false,
    gameOver: false,
    minefield: []
  })

  const startGame = (settings) => {
    const Minefield = generateMinefield(settings)
    setState({
      ...state,
      settings: settings, 
      gameOn: true,
      gameOver: false, 
      minefield: Minefield
    })
  }

  const flagIt = (position) => {
    if(!state.gameOver && state.gameOn ){
    const oldField = [...state.minefield]
    const oldCell = oldField[position.r][position.c]
    let newCell

    if(oldCell.flag===false && oldCell.maybe===false){
      newCell = {
        ...oldCell,
        maybe: false, 
        flag: true
      }
    }
    else if(oldCell.maybe){
      newCell = {
        ...oldCell,
        maybe: false, 
        flag: false
      }
    }
    else if(oldCell.flag){
      newCell = {
        ...oldCell,
        maybe: true, 
        flag: false
      }
    }

    oldField[position.r][position.c] = newCell
    setState({
      ...state,
      minefield: oldField
    })
  }
  }
  
  const openIt = ({r,c}) => {
    let adjacentCellPositions = [
      [r-1,c], 
      [r-1,c+1], 
      [r,c+1], 
      [r+1,c+1], 
      [r+1,c], 
      [r+1,c-1], 
      [r,c-1], 
      [r-1,c-1]
    ]

    let max=state.settings.size
    
    console.log('count adjacent mines')
    let adjacentMineCount = adjacentCellPositions.reduce((acc,[r,c])=>{
      if(r>=0 && r<max && c>=0 && c<max){
        return acc + (state.minefield[r][c].hasMine?1:0)
      }
      return acc
    },0)

    console.log('count adjacent flags')
    let adjacentFlagCount = adjacentCellPositions.reduce((acc,[r,c])=>{
      if(r>=0 && r<max && c>=0 && c<max){
        return acc + (state.minefield[r][c].flag?1:0)
      }
      return acc
    },0)

    console.log('flag count',adjacentFlagCount);

    let gameOver = state.gameOver
    if(!gameOver && state.gameOn ){


    const oldField = [...state.minefield]
    const oldCell = oldField[r][c]
    let newCell = oldCell

    if(oldCell.flag){
      console.log('cannot open. has flag');
    }

    else if(oldCell.hasMine){
      console.log('opened a cell that has a mine. game over');
      newCell = {
        ...oldCell,
        open: true,
        hasMine: true
      }
      gameOver = true
      oldField[r][c] = newCell
      setState({
        ...state,
        gameOver: gameOver,
        gameOn: !gameOver,
        minefield: oldField
      })
    }

    else if(oldCell.open && adjacentFlagCount<adjacentMineCount){
      console.log('this cell is already open');
    }

    else {
      console.log('opening cell');

      newCell = {
        ...oldCell,
        open: adjacentMineCount
      }
      oldField[r][c] = newCell
      setState({
        ...state,
        gameOver: gameOver,
        gameOn: !gameOver,
        minefield: oldField
      })
console.log('mine count',adjacentMineCount);
      if(adjacentMineCount<=adjacentFlagCount){
        adjacentCellPositions.forEach(([r,c])=>{
          if(r>=0 && r<max && c>=0 && c<max){
            if(state.minefield[r][c].open===false){
              openIt({r:r,c:c})
            }
          }
        })
      }


    }


  }

  }
  
  

  return (
    <div className="App">
      <h1 style={{position:'absolute',top:30, color: '#e00'}}>{state.gameOver ? "Game Over" : ""}</h1>
      <ActionBar startGame={startGame} gameOn={state.gameOn || state.gameOver}/>
      <Container size={state.minefield.length}>
        {state.minefield.map(
          (v,vi)=>v.map(
            (c,ci)=>
              <Cell key = {`${vi.toString()} ${ci.toString()}`} 
                position = {{r:vi,c:ci}}
                flagIt = {flagIt}
                openIt = {openIt}
                flag = {(state.minefield[vi][ci].hasMine && state.gameOver)?false:state.minefield[vi][ci].flag}
                maybe = {state.minefield[vi][ci].maybe}
                open = {state.minefield[vi][ci].open}
                mine = {(
                  state.minefield[vi][ci].hasMine && state.minefield[vi][ci].open)
                  || (state.gameOver && state.minefield[vi][ci].hasMine) }
                exploded = {state.minefield[vi][ci].hasMine && state.minefield[vi][ci].open }
              />))}

        {/* <Cell />
        <Cell />
        <Cell open />
        <Cell flag />
        <Cell flag maybe/>
        <Cell mine/>
        <Cell mine exploded/>
        <Cell open="1"/>
        <Cell /> */}
      </Container>
      <div style={{color: '#eee'}}>Click to Reveal Tile. Right-Click to set a Flag.</div>
    </div>
  );
}

export default App;
