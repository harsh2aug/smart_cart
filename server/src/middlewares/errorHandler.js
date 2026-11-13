import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

// Every error in the app ends up here and is sent back as { error: "..." }
// Express knows this is an error handler because it has 4 parameters.
export function errorHandler(err, _req, res, _next) {
  // Input failed validation (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Invalid input',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // An error we threw on purpose
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Request body is not valid JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must be valid JSON' });
  }

  // Database unique rule broken (e.g. two sign-ups with the same phone at the same moment)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'This record already exists' });
  }

  // Anything else is a bug: log it, but never show details to the user
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}

// Request for a URL that does not exist
export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}
