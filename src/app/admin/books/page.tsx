import { AdminProductTable } from "@/components/admin/AdminProductTable";

export default function AdminBooks() {
  return (
    <AdminProductTable
      title="Books"
      category="books"
      productType="BOOK"
      newLabel="New book"
      newType="BOOK"
      columns={["author", "price"]}
    />
  );
}
