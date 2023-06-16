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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createQuoteRequest } from 'apiSdk/quote-requests';
import { Error } from 'components/error';
import { quoteRequestValidationSchema } from 'validationSchema/quote-requests';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { VendorInterface } from 'interfaces/vendor';
import { BrideGroomInterface } from 'interfaces/bride-groom';
import { getVendors } from 'apiSdk/vendors';
import { getBrideGrooms } from 'apiSdk/bride-grooms';
import { QuoteRequestInterface } from 'interfaces/quote-request';

function QuoteRequestCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: QuoteRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createQuoteRequest(values);
      resetForm();
      router.push('/quote-requests');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<QuoteRequestInterface>({
    initialValues: {
      status: '',
      vendor_id: (router.query.vendor_id as string) ?? null,
      bride_groom_id: (router.query.bride_groom_id as string) ?? null,
    },
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
            Create Quote Request
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'quote_request',
  operation: AccessOperationEnum.CREATE,
})(QuoteRequestCreatePage);
