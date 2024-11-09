export type CanBeNull<T> = null | undefined | T;

export interface Usecase<I, O> {
  execute(input: I): Promise<O>;
}

export class HttpException extends Error {
  constructor(message: string, status: number) {
    super(message);
  }
}
