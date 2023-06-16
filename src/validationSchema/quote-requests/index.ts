import * as yup from 'yup';

export const quoteRequestValidationSchema = yup.object().shape({
  status: yup.string().required(),
  vendor_id: yup.string().nullable(),
  bride_groom_id: yup.string().nullable(),
});
