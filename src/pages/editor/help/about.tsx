const HelpAbout = () => {
    return (
        <div>
            <h3 className="font-bold">Quarrel v{APP_VERSION}</h3>
            <p>Quarrel is a tool to help make crossword puzzles</p>
            <p>
                Quarrel is open source software: Contributions are welcome, go
                to the{" "}
                <a
                    href="https://github.com/dominicprice/quarrel"
                    className="text-sky-600 underline"
                >
                    GitHub repo
                </a>{" "}
                to find out more
            </p>
            <hr className="my-2" />
            <p>Quarrel is released under the MIT licence</p>
            <p className="whitespace-pre-wrap">{APP_LICENCE}</p>
        </div>
    );
};

export default HelpAbout;
