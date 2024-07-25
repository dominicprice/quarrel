import { toast } from "react-toastify";

const isError = (err: unknown): err is Error => err instanceof Error;
const isString = (err: unknown): err is string => typeof err === "string";

function notifyError(err: unknown, msg?: string, toastId?: string) {
    console.error(err);
    const title = msg ?? "An error occurred";
    let description = "See console for more details";
    if (isError(err)) description = err.message;
    else if (isString(err)) description = err;

    if (toastId) {
        toast.update(toastId, {
            render: () => (
                <>
                    <p>{title}</p>
                    <p className="text-sm">{description}</p>
                </>
            ),
            type: "error",
            isLoading: false,
        });
    } else {
        toast(
            <>
                <p>{title}</p>
                <p className="text-sm">{description}</p>
            </>,
            { type: "error" },
        );
    }
}

export { notifyError };
