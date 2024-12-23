import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { baseURL } from "../config/config";

const Users = () => {
  const [data, setData] = useState([]); // State for user data

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this user?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseURL}/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire("Deleted!", "Your user has been deleted.", "success");
          setData((prevData) => prevData.filter((user) => user._id !== userId));
        } else {
          Swal.fire("Error", "There was an issue deleting the user.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while deleting the user.",
          "error"
        );
      }
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 150 },
    { field: "role", headerName: "Role", flex: 1, minWidth: 100 },
    {
      field: "delete",
      headerName: "",
      flex: 0.5,
      minWidth: 50,
      renderCell: (params) => (
        <FaTrash
          className="text-red-500 cursor-pointer m-2"
          onClick={() => handleDeleteUser(params.row._id)}
        />
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseURL}/users`);
        const users = await response.json();
        setData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-5">
      <div className="flex flex-col md:flex-row items-center justify-between mb-5">
        <h1 className="text-lg font-bold">All Users</h1>
      </div>
      <div className="w-full overflow-x-auto">
        <DataGrid
          getRowId={(row) => row._id}
          rows={data}
          checkboxSelection
          columns={columns}
          autoHeight
          className="bg-white rounded-lg shadow-lg"
          sx={{
            "& .MuiDataGrid-root": {
              fontSize: "0.9rem",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Users;
