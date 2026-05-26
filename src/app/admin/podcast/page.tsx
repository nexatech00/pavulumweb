import { AdminProductTable } from "@/components/admin/AdminProductTable";

export default function AdminPodcast() {
  return (
    <AdminProductTable
      title="Podcast"
      productType="PODCAST"
      newLabel="New episode"
      newType="PODCAST"
      columns={["price"]}
      emptyText="No podcast episodes yet."
    />
  );
}
