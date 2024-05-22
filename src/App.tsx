import { ChangeEvent, useState } from 'react'
import './App.css'
import Letter from './Letter.tsx'
import './Letter.css'
import LetterStatus from './LetterStatus.tsx'
import LetterProps from './LetterProps.tsx'
import valid_words from './valid_words.ts'
import validateWord from './Backend.ts'


function GetEmptyRow() : LetterProps[]
{
  const result = Array(5).fill({letter : '', status : LetterStatus.NOT_SET});
  return result;
}

function GetEmptyBoard() : LetterProps[][]
{
  const result = Array(6).fill(GetEmptyRow());
  return result;
}

function ConvertResult(attempt : number, data : LetterProps[], board : LetterProps[][])
{
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


function isVictory(latest_attempt : LetterProps[]) : boolean
{
  for(const letter of latest_attempt)
    if(letter.status != LetterStatus.CORRECT)
      return false;

  return true;
}

function App() {
  const [letterInfo, setLetterInfo] = useState(GetEmptyBoard());
  const [inputText, setInputText] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [answer, setAnswer] = useState(valid_words[Math.floor(Math.random() * valid_words.length)]);
  const [status, setStatus] = useState("Good luck!");
  const [won, setWon] = useState(false);

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {
    if(attempt === 6 || won)
    {
      return;
    }

    const response = validateWord(answer, inputText);
    if(response.length === 5)
    {
      console.log("Valid word");
      const new_board =  ConvertResult(attempt, response, letterInfo); 
      setLetterInfo(new_board);
      setAttempt(attempt + 1);
      setInputText("");

      if(isVictory(new_board[attempt]))
      {
        setWon(true);
        setStatus("Congratulations!");
        return;
      }

      if(attempt === 5)
      {
        setStatus("Oh no! The answer was: " + answer);
        return;
      }

      setStatus("Keep trying :) ");
      
    }
    else 
    {
      setStatus("Invalid word!");
    }
  };

  const handleReset = async () => {

    setAnswer(valid_words[Math.floor(Math.random() * valid_words.length)]);
    setAttempt(0);
    setLetterInfo(GetEmptyBoard());
    setStatus("Good luck!");
    setWon(false);
  };

  const handleKeyPress = (event : any) => {
    if (event.key === 'Enter') 
      handleSubmit();
  };


  return (
    <>
    <div>

      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        onKeyDownCapture={handleKeyPress}
        placeholder="Enter your guess"
      />
        <button onClick={() => handleSubmit()}>
          Submit
        </button>
        <button onClick={() => handleReset()}>
          New Word
        </button>
      </div>
      <div>
        {status}
      </div>

         { letterInfo.map((row, row_idx) => (
           
           <div key={row_idx} className='container'>
              {row.map((letter, index) => (
                <div key={index} className='componentWrapper'>
                  <Letter {...letter}></Letter>
                </div>
              ))}
            </div>
          ))}
    </>
  )
}

export default App
