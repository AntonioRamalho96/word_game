import LetterProps from "./LetterProps";
import LetterStatus from "./LetterStatus";
import valid_words from "./valid_words";



function removeFirstOccurrence<T>(arr: T[], element: T): void {
    // Find the index of the first occurrence of the element
    const index = arr.indexOf(element);

    // If the element is found in the array
    if (index !== -1) {
        // Use splice to remove the element at the found index
        arr.splice(index, 1);
    }

}



//constructor() {
//    this.valid_words = valid_words;
//    const n: number = Math.floor(Math.random() * valid_words.length);
//    this.answer = valid_words[n];
//    this.validateWord = this.validateWord.bind(this);
//    console.log(this.answer);
//}


function validateWord(answer: string, guess: string): LetterProps[] {
    let result: LetterProps[] = [];
    let remaining_letters: string[] = [];
    let remaining_indexes: number[] = [];

    guess = guess.toUpperCase();

    if (guess.length != 5)
        return [];
    if (!valid_words.includes(guess))
        return [];


    for (const letter of guess) {
        result.push({ letter: letter, status: LetterStatus.ABSENT });
    }
    for (const letter of answer) {
        remaining_letters.push(letter);
    }


    // Check for correct ones
    for (let i: number = 0; i < 5; i++) {
        if (guess[i] === answer[i]) {
            result[i].status = LetterStatus.CORRECT;
            removeFirstOccurrence(remaining_letters, result[i].letter);
        } else {
            remaining_indexes.push(i);
        }
    }

    // Check for existing ones
    for (const i of remaining_indexes) {

        if (remaining_letters.includes(guess[i])) {

            result[i].status = LetterStatus.PRESENT
            removeFirstOccurrence(remaining_letters, guess[i]);
        }

    }

    return result;
}


export default validateWord;