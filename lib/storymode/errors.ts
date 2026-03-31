export class StorymodeError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export function handleStorymodeError(err: any) {
  console.error('Storymode Error:', err);
  return {
    error: err.message || 'Unknown Storymode error',
    status: err.status || 500
  };
}
