import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
      <button className={props.classType}
              onClick={props.onClick}>
                {props.value}
      </button>
    )
}


class Board extends React.Component {
  renderSquare(i, isHighLight) {
    return (
      <Square key={i}
              value={this.props.squares[i]}
              onClick={()=>this.props.onClick(i)}
              classType={isHighLight? "square highlight-square":"square"}
      />)
  }

  render() {
    // Challenge 2: render squares using loop
    const winLine = this.props.winLine
    const isHighlight = (idx) => (winLine? winLine.includes(idx) : false)
    const squareBoard = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]  // Is this still hard-coded anyway?
    return (
      <div>
        {squareBoard.map((row, i) =>
          <div className="board-row"
               key={i}>
            {row.map(square => this.renderSquare(square, isHighlight(square)))}
          </div>
        )}
      </div>
    )
  }
}

class HistoryBoard extends React.Component {
  renderMoveList = (step, move) => {
    const descTurn = (move % 2 === 1)? 'X': 'O'
    const descText = (move && move !== 0) ?
          `Go to move #${move} ${descTurn}(${step.latest[0]}, ${step.latest[1]})`
          : 'Go to game start'
      // Challenge 1: make clicked move BOLD
    const desc = (move === this.props.stepNumber) ? <b>{descText}</b> : descText

    return (
        <li key={move}>
          <button onClick={()=> this.props.onClick(move)}>
            {desc}
          </button>
        </li>
      )
    }

  render() {
    // Challenge 3: make reverse show option
    const history = [...this.props.history]
    return ((!this.props.showReverse) ?
        <ol>
          {history.map((step, move) => this.renderMoveList(step, move))}
        </ol>
      :  // Reverse show
        <ol>
        {history.reverse().map((step, move) => this.renderMoveList(step, history.length-1 - move))}
        </ol>
  )}
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        latest: Array(2).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      showReverse: false  // Challenge 3
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        latest: [Math.floor(i/3), i%3]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  handleReverseToggle = () => this.setState({showReverse: !this.state.showReverse})

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render(){
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winLine = calculateWinner(current.squares)
    const winner = winLine? current.squares[winLine[0]] : null

    let status
    if (winner) {
      status = `Winner: ${winner} !`
    } else if (!winner && this.state.stepNumber === 9) {
      status = 'Draw. try again!'
    }
    else {
        status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
            winLine={winLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <HistoryBoard
            history={this.state.history}
            onClick={(i)=>this.jumpTo(i)}
            stepNumber={this.state.stepNumber}
            showReverse={this.state.showReverse}
          />
        </div>
        <button className="toggle"
                onClick={()=>this.handleReverseToggle()}>
          Show Reverse
        </button>
      </div>
    )
  }
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

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
  ]
  for (var line of lines) {
    const [a, b, c] = line
    if (squares[a] 
      && (squares[a] === squares[b]) 
      && (squares[a] === squares[c])) {
      return [a, b, c]
    }
  }
  return null
}
