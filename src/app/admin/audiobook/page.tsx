import { AdminProductTable } from "@/components/admin/AdminProductTable";

export default function AdminAudiobook() {
  return (
    <AdminProductTable
      title="Audiobooks"
      productType="AUDIOBOOK"
      newLabel="New audiobook"
      newType="AUDIOBOOK"
      columns={["author", "price"]}
      emptyText="No audiobooks yet."
    />
  );
}
