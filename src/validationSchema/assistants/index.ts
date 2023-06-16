import * as yup from 'yup';

export const assistantValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
});
