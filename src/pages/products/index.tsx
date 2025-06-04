import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import type { NextPageWithLayout } from "../_app";
import { useState, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { ProductCatalogCard } from "@/components/shared/product/ProductCatalogCard";
import { api } from "@/utils/api";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/shared/product/ProductForm";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { productFormSchema, type ProductFormSchema } from "@/forms/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const ProductsPage: NextPageWithLayout = () => {
  const apiUtils = api.useUtils();

  const [uploadedProductImageUrl, setUploadedProductImageUrl] = useState<
    string | null
  >(null);
  const [editedProductImageUrl, setEditedProductImageUrl] = useState<
    string | null
  >(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false);
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<string | null>(null);

  const { data: products } = api.product.getProducts.useQuery({
    categoryId: "all",
  });

  const { mutate: createProduct } = api.product.createProduct.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getProducts.invalidate();
      toast.success("Successfully Created Product");
      setCreateProductDialogOpen(false);
    },
  });

  const { mutate: deleteProductById } = api.product.deleteProduct.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getProducts.invalidate();
      toast.success("Successfully Deleted Product");
      setProductToDelete(null);
    },
  });

  const { mutate: editProduct } = api.product.editProduct.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getProducts.invalidate();
      toast.success("Successfully Edited Category");
      editproductForm.reset();
      setProductToEdit(null);
      setEditProductDialogOpen(false);
    },
  });

  const createProductForm = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
  });

  const editproductForm = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
  });

  const handleSubmitCreateProduct = (values: ProductFormSchema) => {
    if (!uploadedProductImageUrl) {
      toast.error("Please upload an image first!");
      return;
    }
    createProduct({
      name: values.name,
      price: values.price,
      categoryId: values.categoryId,
      imageUrl: uploadedProductImageUrl,
    });
  };

  const handleClickDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
  };

  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;

    deleteProductById({
      productId: productToDelete,
    });
  };

  const handleSubmitEditProduct = (data: ProductFormSchema) => {
    if (!productToEdit){
      toast.error("Please upload an image first!");
      return;
    };

    editProduct({
      productId: productToEdit,
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
      imageUrl: editedProductImageUrl || "",
    });
  };

  const handleClickEditProduct = (product: {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    imageUrl: string;
  }) => {
    setProductToEdit(product.id);
    setEditProductDialogOpen(true);
    editproductForm.reset({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <>
      <DashboardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <DashboardTitle>Product Management</DashboardTitle>
            <DashboardDescription>
              View, add, edit, and delete products in your inventory.
            </DashboardDescription>
          </div>

          <AlertDialog
            open={createProductDialogOpen}
            onOpenChange={setCreateProductDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button>Add New Product</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Category</AlertDialogTitle>
              </AlertDialogHeader>

              <Form {...createProductForm}>
                <ProductForm
                  onSubmit={handleSubmitCreateProduct}
                  onChangeImageUrl={(imageUrl) =>
                    setUploadedProductImageUrl(imageUrl)
                  }
                />
              </Form>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={createProductForm.handleSubmit(
                    handleSubmitCreateProduct,
                  )}
                >
                  Create Product
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={!!productToDelete}
            onOpenChange={(open) => {
              if (!open) {
                setProductToDelete(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Are you sure you want to delete this category? This action
                cannot be undone.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDeleteProduct}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={editProductDialogOpen}
            onOpenChange={setEditProductDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Product</AlertDialogTitle>
              </AlertDialogHeader>

              <Form {...editproductForm}>
                <ProductForm
                  onSubmit={handleSubmitEditProduct}
                  onChangeImageUrl={(imageUrl) =>
                    setEditedProductImageUrl(imageUrl)
                  }
                />
              </Form>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={editproductForm.handleSubmit(
                    handleSubmitEditProduct,
                  )}
                >
                  Edit Product
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!products && <p>Loading...</p>}
        {products?.map((product) => (
          <ProductCatalogCard
            key={product.id}
            name={product.name}
            price={product.price}
            category={product.category.name}
            image={product.imageUrl ?? ""}
            onEdit={() =>
              handleClickEditProduct({
                id: product.id,
                name: product.name,
                price: product.price,
                categoryId: product.category.id,
                imageUrl: product.imageUrl ?? "",
              })
            }
            onDelete={() => handleClickDeleteProduct(product.id)}
          />
        ))}
      </div>
    </>
  );
};

ProductsPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductsPage;
