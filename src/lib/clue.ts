class Clue {
    num: number;
    clue: string;
    answer: string;

    constructor(num: number, clue: string = "", answer: string = "") {
        this.num = num;
        this.clue = clue;
        this.answer = answer;
    }

    static fromJSON = (json: any) => {
        const clue = new Clue(json.num, json.clue, json.answer);
        return clue;
    };

    clone = () => {
        return new Clue(this.num, this.clue, this.answer);
    };
}

export default Clue;
