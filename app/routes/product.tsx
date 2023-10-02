import { Stack } from '@chakra-ui/react';
import type { ActionArgs, DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ProductBody from '~/components/product/ProductBody';
import { ImplementGrid } from '~/layouts/Grid';
import { authorize } from '~/middleware/authorization';
import {
  deleteProduct,
  getProduct,
  update,
  updateIsActive,
} from '~/modules/product/product.service';

export async function loader({ request, context, params }: DataFunctionArgs) {
  await authorize({ request, context, params }, '2');

  return await getProduct();
}

export async function action({ request }: ActionArgs) {
  if (request.method.toLowerCase() === 'delete') {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    await deleteProduct(id);
  }

  if (request.method.toLowerCase() === 'patch') {
    const formData = await request.formData();

    const id = formData.get('id') as string;
    const price = formData.get('price');
    const stock = formData.get('stock');
    const isActive =
      (formData.get('isActive') as string) === 'true' ? false : true;

    console.log('ini isactive', isActive);
    console.log('ini stock', price);
    console.log('ini stock', stock);

    if (price || stock) {
      const updatePriceStock = {
        id,
        price,
        stock,
      };
      await update(updatePriceStock);
    } else {
      await updateIsActive({ id, isActive });
    }
  }

  return redirect('/product');
}

export default function Product() {
  const data = useLoaderData<typeof loader>();

  return (
    <ImplementGrid>
      <Stack mt={'7.5vh'} spacing={4}>
        <ProductBody product={data} />
      </Stack>
    </ImplementGrid>
  );
}
