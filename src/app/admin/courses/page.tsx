import { AdminProductTable } from "@/components/admin/AdminProductTable";

export default function AdminCourses() {
  return (
    <AdminProductTable
      title="Courses"
      category="courses"
      productType="COURSE"
      newLabel="New course"
      newType="COURSE"
      columns={["author", "price", "delivery"]}
    />
  );
}
