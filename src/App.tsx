import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import './App.css'
import Letter from './Letter.tsx'
import './Letter.css'
import LetterStatus from './LetterStatus.tsx'
import LetterProps from './LetterProps.tsx'
import valid_words from './valid_words.ts'
import validateWord from './Backend.ts'


function GetEmptyRow(): LetterProps[] {
  const result = Array(5).fill({ letter: '', status: LetterStatus.NOT_SET });
  return result;
}

function GetEmptyBoard(): LetterProps[][] {
  const result = Array(6).fill(GetEmptyRow());
  return result;
}

function ConvertResult(attempt: number, data: LetterProps[], board: LetterProps[][]) {
  // Converts the status in each element of the array 
  // from string to the enum value
  const nextBoard = board.map((row, idx) => {
    if (idx === attempt)
      return data;
    else
      return row;
  });

  return nextBoard;
}

function modifyBoard(board: LetterProps[][], row: number, col: number, txt: string) {
  const nextBoard: LetterProps[][] = JSON.parse(JSON.stringify(board));

  nextBoard[row][col].letter = txt.toUpperCase();

  return nextBoard;

}

function getString(board: LetterProps[][], row: number) {
  let result = "";
  for (let i = 0; i < 5; i++)
    result += board[row][i].letter;
  return result;
}


function isVictory(latest_attempt: LetterProps[]): boolean {
  for (const letter of latest_attempt)
    if (letter.status != LetterStatus.CORRECT)
      return false;

  return true;
}

function App() {

  const [answer, setAnswer] = useState(valid_words[Math.floor(Math.random() * valid_words.length)]);
  const [letterInfo, setLetterInfo] = useState(GetEmptyBoard());


  const [attempt, setAttempt] = useState(0);
  const [cursor, setCursor] = useState(0);

  const [status, setStatus] = useState("Good luck!");
  const [won, setWon] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If the key is a letter
    if (e.key.length === 1 && e.key >= 'a' && e.key <= 'z' && cursor < 5) {
      const modified_board = modifyBoard(letterInfo, attempt, cursor, e.key);
      setLetterInfo(modified_board);
      setCursor(cursor + 1);
    }

    // If the user pressed Backspace
    if (e.key == 'Backspace' && cursor > 0) {

      setLetterInfo(modifyBoard(letterInfo, attempt, cursor - 1, ''));
      setCursor(cursor - 1);
    }

    // If the user pressed ENTER
    if (e.key == 'Enter' && cursor == 5) {
      handleSubmit();
    }
  }

  const handleBlur = () => {
    console.log("Handle blur")
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

  }, []);


  const handleSubmit = async () => {
    if (attempt === 6 || won) {
      return;
    }

    const input_word = getString(letterInfo, attempt);

    const response = validateWord(answer, input_word);
    if (response.length === 5) {
      console.log("Valid word");
      const new_board = ConvertResult(attempt, response, letterInfo);

      setLetterInfo(new_board);
      setAttempt(attempt + 1);
      setCursor(0);

      if (isVictory(new_board[attempt])) {
        setWon(true);
        setStatus("Congratulations!");
        return;
      }

      if (attempt === 5) {
        setStatus("Oh no! The answer was: " + answer);
        return;
      }

      setStatus("Keep trying :) ");

    }
    else {
      setStatus("Invalid word!");
    }
  };

  const handleReset = async () => {

    setAnswer(valid_words[Math.floor(Math.random() * valid_words.length)]);
    setLetterInfo(GetEmptyBoard());

    setAttempt(0);
    setCursor(0);

    setStatus("Good luck!");
    setWon(false);

    // Prevent the scope to stick to this button
    buttonRef.current?.blur();
    inputRef.current?.focus();
  };

  return (
    <>



      <button ref={buttonRef} onClick={() => handleReset()}>
        New Word
      </button>
      <div>
        {status}
      </div>

      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={{
          position: 'absolute',
          top: '-1000px',
          left: '-1000px',
          opacity: 0,
          height: 0,
          width: 0,
          border: 'none'
        }}
      />

      {
        letterInfo.map((row, row_idx) => (

          <div key={row_idx} className='container'>
            {row.map((letter, index) => (
              <div key={index} className='componentWrapper'>
                <Letter {...letter}></Letter>
              </div>
            ))}
          </div>
        ))
      }
    </>
  )
}

export default App
