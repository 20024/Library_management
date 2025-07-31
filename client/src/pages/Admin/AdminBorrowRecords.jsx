import React, { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import BorrowRecordsTable from "../../component/Admin/BorrowRecords";
import Unauthorized from "../../component/Admin/Unauthorized";

const AdminBorrowRecords = () => {
  const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      setShowModal(true);
    }
  }, []);

  const handleClose =()=>{
    navigate("/admin")
  }
  if (showModal) {
    return <Unauthorized onClose={handleClose} />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📄 Borrow Records</h1>
      <BorrowRecordsTable />
    </div>
  );
};

export default AdminBorrowRecords;
