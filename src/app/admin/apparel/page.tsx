import { AdminProductTable } from "@/components/admin/AdminProductTable";

export default function AdminApparel() {
  return (
    <AdminProductTable
      title="Apparel"
      category="apparel"
      productType="APPAREL"
      newLabel="New item"
      newType="APPAREL"
      columns={["price", "delivery"]}
    />
  );
}
