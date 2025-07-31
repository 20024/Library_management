import React from "react";
import AdminBookTable from "../../component/Admin/AdminBookTable";

const AdminBooks = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"> admin pannel</h1>
      <AdminBookTable />
    </div>
  );
};

export default AdminBooks;
