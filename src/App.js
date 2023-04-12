import { useState } from "react";

function Square({value, onSquareClick }){
  return ( 
    <button className="square"  onClick={onSquareClick}>
        {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i){

    if(squares[i] || calculateWinner(squares)){  // 이미 체크가 되어있거나  승리조건에 부합했을 경우 return
        return;
    }

    const nextSquares = squares.slice(); // 원본 배열을 복사하여 변수에 담음 

    if(xIsNext){ // 턴에 따라 X 혹은 O로 체크 
      nextSquares[i] = "X";
    }else{
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);  // props에 전달 
  }
  
  const winner = calculateWinner(squares); //다음 턴 혹은 승리 나타냄
  let status;
  if(winner){
    status = "Winner: " + winner;
  } else{
    status = "Next player: " + (xIsNext ? "X":"O")
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      {/* 화살표 함수를 쓰지 않으면 다음과 같은 무한루프로 인해 의도대로 코드가 실행되지 않는다
      a. 컴포넌트가 처음 시작되어 렌더링됩니다.
      b. handleClick 함수가 즉시 실행되어 onPlay 함수가 호출됩니다.
      c. onPlay는 Game 컴포넌트의 handlePlay 함수를 실행합니다.
      d. 이로 인해 상태가 변경되고, 상태 변경으로 인해 Game 컴포넌트가 다시 렌더링됩니다.
      e. Game 컴포넌트의 렌더링으로 인해 handleClick이 다시 즉시 실행되어 무한 루프가 발생한다
      => (화살표 함수) 로 이벤트 핸들러를 추가해 클릭만 할때 이벤트가 발생하여 무한 루프를 방지한다 */}

    </>
  );
};

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]); //게임의 과거 게임 상태
  const [currentMove, setCurrentMove] = useState(0); // 현재 진행한 게임의 턴 수 
  const xIsNext = currentMove % 2 === 0; // 짝수면 X의 차례 , 홀수면 O의 차례
  const currentSquares = history[currentMove]; // 현재 게임의 상태를 나타내는 square 배열 가져ㅇㅁ

  function handlePlay(nextSquares){ //새로운 이동 발생시 소출 
      const nextHistory = [...history.slice(0, currentMove+1), nextSquares]; //현재까지의 이동을 가져오고 새로운 이동 추가
      setHistory(nextHistory); //현재 이동기록으로 업데이트             
      setCurrentMove(nextHistory.length -1);  // 현재 이동상태 , 현재 게임 상태의 인덱스를 가져오기 위해-1을 해줘야함      
  }

  function jumpTo(nextMove)  { //선택한 이전 게임으로 이동함
    setCurrentMove(nextMove);        
  }

  const moves = history.map((squares, move) =>{ // 과거 기록으로 넘어갈 수 있는 버튼 생성,  squares는 각 이동에 대한 게임 상태, move는 배열의 인덱스
    // console.log("squares : "+squares);
    // console.log("move : "+move);
    let description;
    if(move>0){
      description = 'Go to move #'+ move;
    } else {
      description = 'Go to game start';
    }
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })
  // console.log의 값
  // ----------------
  // squares : ,,,,,,,, -> 모든 칸이 비어있음
  // move : 0 ( 턴 번호 )
  // squares : X,,,,,,,, -> 클릭 후 칸 추가 됌
  // move : 1 ( 턴 번호 )
  // square를 삭제하면 오류가 발생하는데 , 이는 move가 첫 번째 인수가 간주되기 때문이다.
  // map의 인수는 다음과 같다 ( 첫 번째 인수: 배열의 현재 요소, 두 번째 요소: 현재 요소의 인덱스 , 세 번째 요소: map()이 호출된 배열)
  // 즉 square를 삭제하면 move가 index가 아니게 되어 예상대로 작동하지 않아 오류가 발생한다.
  
  
  return(
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}


function calculateWinner(squares){
  const lines = [  // 승리 조건
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]   
  ];
  
  for(let i=0;i<lines.length;i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { // 승리 조건을 매칭시켜 확인 
      return squares[a];
    }
  }

  return null;
}
