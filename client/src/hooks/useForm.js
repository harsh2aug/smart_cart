import { useState } from 'react';

// Everything a form needs: values, errors and a "waiting" flag.
//   const { values, errors, handleChange, handleSubmit } = useForm({ phone: '' });
//   <form onSubmit={handleSubmit(async (values) => { ...call the server... })}>
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({}); // one message per input, e.g. { phone: '...' }
  const [formError, setFormError] = useState(''); // one message for the whole form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Works for every input, because each input has a name="..." that matches a key in values
  function handleChange(event) {
    const { name, value } = event.target;
    setValues((old) => ({ ...old, [name]: value }));
    setErrors((old) => ({ ...old, [name]: '' })); // hide the old error while typing
  }

  function handleSubmit(onSubmit) {
    return async (event) => {
      event.preventDefault(); // stop the browser from reloading the page
      setIsSubmitting(true);
      setErrors({});
      setFormError('');
      try {
        await onSubmit(values);
      } catch (error) {
        // Errors for single inputs go under those inputs; other errors go above the button
        const fields = error.fields ?? {};
        setErrors(fields);
        setFormError(Object.keys(fields).length > 0 ? '' : error.message);
      } finally {
        setIsSubmitting(false);
      }
    };
  }

  return { values, errors, formError, isSubmitting, handleChange, handleSubmit };
}
