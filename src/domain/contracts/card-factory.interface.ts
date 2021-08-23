export interface CardFactory<T = unknown> {
    build: (message: unknown) => Promise<T>
}
