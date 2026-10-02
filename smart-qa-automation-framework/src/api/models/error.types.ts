export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    field?: string;
  };
}
