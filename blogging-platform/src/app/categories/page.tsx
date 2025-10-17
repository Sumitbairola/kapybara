"use client";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { useState } from "react";

type CategoryFormData = {
  name: string;
  description?: string;
};

export default function CategoriesPage() {
  const { data: categories, refetch } = trpc.category.getAll.useQuery();
  const createCategory = trpc.category.create.useMutation();
  const deleteCategory = trpc.category.delete.useMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await createCategory.mutateAsync(data);
      reset();
      await refetch();
    } catch (error) {
      console.error("Failed to create category:", error);
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
      await refetch();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-600 mt-1">
          Organize your blog posts with categories
        </p>
      </div>

      {/* Create Category Form */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Category name is required" })}
              placeholder="e.g., Technology, Travel, Food"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              {...register("description")}
              placeholder="Brief description of this category"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={createCategory.isPending}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {createCategory.isPending ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">All Categories</h2>
        {categories && categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deletingId === cat.id}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    {deletingId === cat.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              No categories yet. Create your first category above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
