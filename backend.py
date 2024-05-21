import random
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder="dist/assets", template_folder='dist')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



def LoadValidWords():
    result = []
    with open("valid_words.txt") as f:
        for line in f.readlines():
            result.append(line.strip().upper())
    return result


valid_words = LoadValidWords()


class LetterStatus:
    NOT_SET = "NOT_SET"
    CORRECT = "CORRECT"
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"

class LetterInfo:
    def __init__(self, letter, status) -> None:
        self.letter = letter
        self.status = status


def findFirstAndRemove(remaining_letters : list, char : str):
    is_present = (char in remaining_letters)
    if is_present:
        remaining_letters.remove(char)
    return is_present
        

def to_letters(input : str):
    result = [LetterInfo(input[i],LetterStatus.ABSENT) for i in range(5)]
    remaining_letters = [char for char in answer]
    remaining_idxs = []

    # Check for correct ones
    for i in range(5):
        if input[i] == answer[i]:
            result[i].status =  LetterStatus.CORRECT
            remaining_letters.remove(input[i])
        else:
            remaining_idxs.append(i)
    
    # Check for existing ones
    for i in remaining_idxs:
        if input[i] in remaining_letters:
            result[i].status = LetterStatus.PRESENT
            remaining_letters.remove(input[i])

    return [letter.__dict__ for letter in result]

@app.route('/reset', methods=['GET'])
@cross_origin()
def reset():
    global attempt
    attempt = 0
    return jsonify({'all': 'good'})


@app.route('/check', methods=['POST'])
@cross_origin()
def reverse_text():
    global attempt
    global valid_words
    data = request.json
    if 'text' in data:
        try:
            word = data["text"].upper()
            if word not in valid_words:
                return jsonify({'error': 'Invalid word'}), 422
            if len(word) != 5:
                return jsonify({'error': 'Word must have 5 characters'}), 422

            response = to_letters(word)
            attempt += 1                                
            return jsonify({'result': response, 'attempt' : attempt})
        except Exception as e:
            return jsonify({'error': e.args[0]}), 500

    else:
        return jsonify({'error': 'Text not provided'}), 400


@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    attempt = 0
    answer = valid_words[random.randint(0, len(valid_words) - 1)]
    app.run(debug=True)