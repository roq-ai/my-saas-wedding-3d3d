import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getQuoteRequestById, updateQuoteRequestById } from 'apiSdk/quote-requests';
import { Error } from 'components/error';
import { quoteRequestValidationSchema } from 'validationSchema/quote-requests';
import { QuoteRequestInterface } from 'interfaces/quote-request';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { VendorInterface } from 'interfaces/vendor';
import { BrideGroomInterface } from 'interfaces/bride-groom';
import { getVendors } from 'apiSdk/vendors';
import { getBrideGrooms } from 'apiSdk/bride-grooms';

function QuoteRequestEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<QuoteRequestInterface>(
    () => (id ? `/quote-requests/${id}` : null),
    () => getQuoteRequestById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: QuoteRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateQuoteRequestById(id, values);
      mutate(updated);
      resetForm();
      router.push('/quote-requests');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<QuoteRequestInterface>({
    initialValues: data,
    validationSchema: quoteRequestValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Quote Request
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<VendorInterface>
              formik={formik}
              name={'vendor_id'}
              label={'Select Vendor'}
              placeholder={'Select Vendor'}
              fetcher={getVendors}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<BrideGroomInterface>
              formik={formik}
              name={'bride_groom_id'}
              label={'Select Bride Groom'}
              placeholder={'Select Bride Groom'}
              fetcher={getBrideGrooms}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.id}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'quote_request',
  operation: AccessOperationEnum.UPDATE,
})(QuoteRequestEditPage);
