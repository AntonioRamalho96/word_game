import React from 'react';
import Letter from './Letter';
import LetterStatus from './LetterStatus';

class Board extends React.Component
{

    constructor(props : {})
    {
        super(props);
        this.state = 
        {            
            board : this.createBoard() 
        }
    }

    createBoard() : Letter[][]
    {
        const board : Letter[][] = [];
        for(let i=0 ; i<5 ; i++)
        {
            board.push(new Array(5).fill(new Letter({letter : '', status: LetterStatus.NOT_SET})));
        }
        return board;
    }

}

export default Board;