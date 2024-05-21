import { ChangeEvent, useState } from 'react'
import './App.css'
import Letter from './Letter.tsx'
import './Letter.css'
import LetterStatus from './LetterStatus.tsx'
import LetterProps from './LetterProps.tsx'


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

function GetRequestInfo(input : string) : RequestInit
{
  const request_info = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ text: input})
  };

  return request_info;
}

function ConvertResult(data : any, board : LetterProps[][])
{
  // Converts the status in each element of the array 
  // from string to the enum value
  let letter_aray : any[] = data.result;
  const converted = letter_aray.map(item => {
    item.status = LetterStatus[item.status];
    return item;
  });

  const nextBoard = board.map((row, idx) => {
    if (idx === data.attempt - 1)
      return converted;
    else
      return row;
  });

  return nextBoard;

}


function App() {
  const [letterInfo, setLetterInfo] = useState(GetEmptyBoard());
  const [inputText, setInputText] = useState('');

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {

    const address = 'http://localhost:5000/check';
    try {
      const response = await fetch(address, GetRequestInfo(inputText));
      const data = await response.json();
      if(!response.ok)
        console.log(data.error)
      setLetterInfo(ConvertResult(data, letterInfo));
    } catch (error) {
      console.log("Error")
    }
  };

  const handleReset = async () => {

    const address = 'http://localhost:5000/reset';
    try {
      await fetch(address);
      setLetterInfo(GetEmptyBoard());
    } catch (error) {
      console.log("Error")
    }
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
          Reset
        </button>
      </div>

         { letterInfo.map((row) => (

           <div className='container'>
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
