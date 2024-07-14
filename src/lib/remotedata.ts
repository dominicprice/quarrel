// util functions and types

type HasSetState<StateT, PropsT> = {
    setState: (state: (prevState: StateT, props: PropsT) => StateT, callback?: () => void) => void
}

function getErrorMessage(error: any): string {
    if (error instanceof Error)
        return error.message;
    return JSON.stringify(error);
}

// External data
enum ExternalDataState {
    NotAsked = 1,
    Loading,
    Error,
    Success
}

type _ExternalDataNotAsked = {
    state: ExternalDataState.NotAsked;
}

type _ExternalDataLoading = {
    state: ExternalDataState.Loading;
}

type _ExternalDataError<ErrorType> = {
    state: ExternalDataState.Error;
    error: ErrorType;
}

type _ExternalDataSuccess<SuccessType> = {
    state: ExternalDataState.Success;
    value: SuccessType;
}

type _ExternalData<SuccessType, ErrorType> =
    _ExternalDataNotAsked |
    _ExternalDataLoading |
    _ExternalDataError<ErrorType> |
    _ExternalDataSuccess<SuccessType>;

type _ExternalDataSwitchList<SuccessType, ErrorType, ReturnType> = {
    notAsked: () => ReturnType;
    loading: () => ReturnType;
    error: (error: ErrorType) => ReturnType;
    success: (value: SuccessType) => ReturnType;
}



class ExternalData<SuccessType, ErrorType> {
    readonly value: _ExternalData<SuccessType, ErrorType>;

    constructor(value?: _ExternalData<SuccessType, ErrorType>) {
        this.value = value || { state: ExternalDataState.NotAsked };
    }

    asNotAsked = () => {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), {
            state: ExternalDataState.NotAsked
        });
    };

    asLoading = () => {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), {
            state: ExternalDataState.Loading
        });
    };

    asError = (error: ErrorType) => {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), {
            state: ExternalDataState.Error,
            error: error
        });
    };

    asSuccess = (value: SuccessType) => {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), {
            state: ExternalDataState.Success,
            error: value
        });
    };

    fold = <ReturnType = void>(cases: _ExternalDataSwitchList<SuccessType, ErrorType, ReturnType>) => {
        switch (this.value.state) {
            case ExternalDataState.NotAsked:
                return cases.notAsked();
            case ExternalDataState.Loading:
                return cases.loading();
            case ExternalDataState.Error:
                return cases.error(this.value.error);
            case ExternalDataState.Success:
                return cases.success(this.value.value);
        }
    };
}

// Promised Data (data received from a promise)
class PromisedData<SuccessType, ErrorType> extends ExternalData<SuccessType, ErrorType> {
    promise = (
        p: Promise<SuccessType>,
        callback: (value: PromisedData<SuccessType, ErrorType>) => void) => {
        p.then(response => {
            callback(this.asSuccess(response));
        }, error => {
            callback(this.asError(error));
        });
        return this.asLoading();
    };

    promiseState = <P, S>(p: Promise<SuccessType>, _this: HasSetState<P, S>, field: string) => {
        _this.setState(state => ({
            ...state,
            [field]: this.promise(p, value => {
                _this.setState(state => ({
                    ...state,
                    [field]: value
                }));
            })
        }));
    };
}

// Remote Data (fetching data over HTTP)
enum HTTPErrorState {
    NetworkError = 1,
    UnexpectedPayload,
    BadResponse
}

type NetworkError = { state: HTTPErrorState.NetworkError };
type UnexpectedPayload = { state: HTTPErrorState.UnexpectedPayload, error: string }
type BadResponse = { state: HTTPErrorState.BadResponse, statusCode: number, body: string }

type HttpError =
    NetworkError |
    UnexpectedPayload |
    BadResponse;

class RemoteData<ResponseType> extends ExternalData<ResponseType, HttpError> {
    fetch = (
        input: RequestInfo | URL,
        callback: (value: RemoteData<ResponseType>) => void,
        converter: (body: string) => ResponseType, ErrorType = JSON.parse,
        init?: RequestInit
    ) => {
        let ok: boolean;
        let statusCode: number;
        fetch(input, init).then(response => {
            ok = response.ok;
            statusCode = response.status;
            return response.text();
        }, _ => {
            callback(this.asError({ state: HTTPErrorState.NetworkError }));
        }).then(body => {
            if (ok) {
                try {
                    callback(this.asSuccess(converter(body || "")));
                } catch (error) {
                    callback(this.asError({
                        state: HTTPErrorState.UnexpectedPayload,
                        error: getErrorMessage(error)
                    }));
                }
            } else {
                callback(this.asError({
                    state: HTTPErrorState.BadResponse,
                    statusCode: statusCode,
                    body: body || ""
                }));
            }
        }, error => {
            callback(this.asError({
                state: HTTPErrorState.UnexpectedPayload,
                error: getErrorMessage(error)
            }));
        });

        return this.asLoading();
    };

    // fetchState = <P, S>(input: RequestInfo | URL, _this: HasSetState<P, S>, field: string) => {
    //     _this.setState((state) => ({
    //         ...state,
    //         [field]: this.fetch(input, (value) => {
    //             _this.setState((state) => ({
    //                 ...state,
    //                 [field]: value
    //             }));
    //         })
    //     }));
    // };
}

export { RemoteData, PromisedData };
export type { HttpError };
