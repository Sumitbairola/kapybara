"use client";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Loader2, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type CategoryFormData = {
  name: string;
  description?: string;
};

export default function CategoriesPage() {
  const router = useRouter();
  const { data: categories, refetch, error: loadError } = trpc.category.getAll.useQuery();
  const createCategory = trpc.category.create.useMutation();
  const deleteCategory = trpc.category.delete.useMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (loadError) {
      toast.error("Failed to load categories", {
        description: "Please try again later.",
      });
    }
  }, [loadError]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await createCategory.mutateAsync(data);
      toast.success("Category created successfully!", {
        description: `"${data.name}" has been added.`,
      });
      reset();
      await refetch();
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category", {
        description: "Please try again later.",
      });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This will remove it from all posts.`
      )
    )
      return;

    try {
      setDeletingId(id);
      await deleteCategory.mutateAsync({ id });
      toast.success("Category deleted", {
        description: `"${name}" has been removed.`,
      });
      await refetch();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category", {
        description: "Please try again later.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Categories
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Organize your blog posts with categories
          </p>
        </div>

        {/* Create Category Form */}
        <Card className="mb-6 sm:mb-8 py-0">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Create New Category
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Add a new category to organize your content
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("name", { required: "Category name is required" })}
                  placeholder="e.g., Technology, Travel, Food"
                  className="text-sm sm:text-base"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </Label>
                <Textarea
                  {...register("description")}
                  placeholder="Brief description of this category..."
                  rows={3}
                  className="resize-none text-sm sm:text-base"
                />
              </div>
              <Button
                type="submit"
                disabled={createCategory.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                {createCategory.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Category"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              All Categories
            </h2>
            {categories && categories.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </Badge>
            )}
          </div>

          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {categories.map((cat) => (
                <Card
                  key={cat.id}
                  className="group hover:shadow-md hover:border-gray-300 transition-all py-0"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {cat.name}
                          </h3>
                        </div>
                        {cat.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={deletingId === cat.id}
                        className="flex-shrink-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                        title="Delete category"
                      >
                        {deletingId === cat.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No categories yet
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Create your first category above to start organizing your blog
                    posts.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
