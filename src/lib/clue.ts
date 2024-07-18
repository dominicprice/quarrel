class Clue {
    num: number;
    clue: string;
    answer: string;

    constructor(num: number, clue = "", answer = "") {
        this.num = num;
        this.clue = clue;
        this.answer = answer;
    }

    static fromJSON = (json: any) => {
        const clue = new Clue(json.num, json.clue, json.answer);
        return clue;
    };

    lengths = () => {
        let res = "";
        let count = 0;
        for (const c of this.answer) {
            if (c == " ") {
                res += count.toString();
                res += ",";
                count = 0;
            } else if (c == "-") {
                res += count.toString();
                res += "-";
                count = 0;
            } else {
                ++count;
            }
        }
        res += count.toString();
        return res;
    };

    clone = () => {
        return new Clue(this.num, this.clue, this.answer);
    };
}

export default Clue;
