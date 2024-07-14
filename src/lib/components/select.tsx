import classNames from "classnames";
import { Component, RefObject, createRef } from "react";

type DropdownOption<ValueType> = {
    label: string;
    value: ValueType;
};

type SelectProps<ValueType> = {
    options?: DropdownOption<ValueType>[];
    getOptions?: (...args: any[]) => DropdownOption<ValueType>[];
    getOptionsArgs?: any[];
    onSelect: (selectedOption: DropdownOption<ValueType>) => void;
};

type SelectState<ValueType> = {
    show: boolean;
    asyncOptions: DropdownOption<ValueType>[];
};

class Select<ValueType> extends Component<
    SelectProps<ValueType>,
    SelectState<ValueType>
> {
    dropdownButton: RefObject<HTMLButtonElement>;

    constructor(props: SelectProps<ValueType>) {
        super(props);
        this.dropdownButton = createRef();
        this.state = {
            show: false,
            asyncOptions: [],
        };
    }

    componentDidMount = () => {
        window.addEventListener("click", (event) => {
            if (event.target instanceof Element) {
                if (event.target === this.dropdownButton.current) return;
            }
            this.hideDropdown();
        });
    };

    showDropdown = () => {
        let opts: DropdownOption<ValueType>[] = [];
        if (this.props.getOptions !== undefined) {
            if (this.props.getOptionsArgs !== undefined) {
                opts = this.props.getOptions.apply(
                    this,
                    this.props.getOptionsArgs,
                );
            }
        }

        this.setState((state) => ({
            ...state,
            show: true,
            asyncOptions: opts,
        }));
    };

    hideDropdown = () => {
        this.setState((state) => ({
            ...state,
            show: false,
        }));
    };

    render = () => {
        const opts = this.state.asyncOptions.concat(this.props.options || []);

        return (
            <div className={classNames("relative", "inline-block")}>
                <button
                    className={classNames(
                        "bg-neutral-100",
                        "rounded-full",
                        "w-4",
                        "h-4",
                        "black",
                        "text-md",
                        "cursor-pointer",
                    )}
                    ref={this.dropdownButton}
                    onClick={() => this.showDropdown()}
                >
                    ?
                </button>
                <div
                    className={classNames(
                        "hidden",
                        "absolute",
                        "bg-neutral-50",
                        "border-1",
                        "z-10",
                    )}
                >
                    {opts.map((o) => (
                        <button
                            className={classNames(
                                "black",
                                "py-1",
                                "px-2",
                                "w-full",
                                "block",
                            )}
                            key={o.label}
                            onClick={() => this.props.onSelect(o)}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };
}

export default Select;
