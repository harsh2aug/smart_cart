// One function for every request to our server.
// The login cookie is sent automatically, because /api is on the same website (Vite proxy).

export class ApiError extends Error {
  constructor(message, status, fields = {}) {
    super(message);
    this.status = status; // 400, 401, 409...
    this.fields = fields; // e.g. { phone: 'Enter a valid 10-digit mobile number' }
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`/api/v1${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only throws when there is no connection at all
    throw new ApiError('Cannot reach the server. Check your internet and try again.', 0);
  }

  const data = await response.json().catch(() => ({})); // some replies have no JSON

  if (!response.ok) {
    // Server sends { error, details: [{ field, message }] } -> make it { field: message }
    const fields = Object.fromEntries((data.details ?? []).map((d) => [d.field, d.message]));
    throw new ApiError(data.error ?? 'Something went wrong', response.status, fields);
  }
  return data;
}
