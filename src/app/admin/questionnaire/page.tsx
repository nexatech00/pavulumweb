import { AdminProductTable } from "@/components/admin/AdminProductTable";

export default function AdminQuestionnaire() {
  return (
    <AdminProductTable
      title="Questionnaires"
      productType="QUESTIONNAIRE"
      newLabel="New questionnaire"
      newType="QUESTIONNAIRE"
      columns={["price"]}
      emptyText="No questionnaires yet."
    />
  );
}
