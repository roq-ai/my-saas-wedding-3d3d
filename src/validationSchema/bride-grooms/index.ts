import * as yup from 'yup';

export const brideGroomValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
});
