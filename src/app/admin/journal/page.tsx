import { AdminProductTable } from "@/components/admin/AdminProductTable";

export default function AdminJournal() {
  return (
    <AdminProductTable
      title="Journal"
      productType="JOURNAL"
      newLabel="New journal"
      newType="JOURNAL"
      columns={["author", "price"]}
      emptyText="No journal entries yet."
    />
  );
}
