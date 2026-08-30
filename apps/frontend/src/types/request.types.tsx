export interface requestStateType {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
}
