import React from "react";


import LetterStatus from "./LetterStatus";
import LetterProps from "./LetterProps";

  
class Letter extends React.Component<LetterProps>
{

    render(): React.ReactNode {
        return <div className="letter" style={{backgroundColor: this.getColor()}}>
            {this.props.letter}
        </div >
    }

    getColor() : string
    {
        switch(this.props.status)
        {
            case LetterStatus.CORRECT:
                return 'green';
            case LetterStatus.PRESENT:
                return 'orange';
            case LetterStatus.ABSENT:
                return 'gray';
            default:
                return 'white';
        }
    }
}

export default Letter