// import React, { Fragment, useEffect } from "react";
// import { DataGrid } from "@material-ui/data-grid";
// import "./productList.css";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { useAlert } from "react-alert";
// import { Button } from "@material-ui/core";
// import MetaData from "../layout/MetaData";
// import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";
// import SideBar from "./Sidebar";
// import {
//   deleteOrder,
//   getAllOrders,
//   clearErrors,
// } from "../../actions/orderAction";
// import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

// const OrderList = ({ history }) => {
//   const dispatch = useDispatch();

//   let orderIdCounter = 1;

//   const alert = useAlert();

//   const { error, orders } = useSelector((state) => state.allOrders);

//   const { error: deleteError, isDeleted } = useSelector((state) => state.order);

//   const deleteOrderHandler = (id) => {
//     dispatch(deleteOrder(id));
//   };

//   useEffect(() => {
//     if (error) {
//       alert.error(error);
//       dispatch(clearErrors());
//     }

//     if (deleteError) {
//       alert.error(deleteError);
//       dispatch(clearErrors());
//     }

//     if (isDeleted) {
//       alert.success("Order Deleted Successfully");
//       history.push("/admin/orders");
//       dispatch({ type: DELETE_ORDER_RESET });
//     }

//     dispatch(getAllOrders());
//   }, [dispatch, alert, error, deleteError, history, isDeleted]);

//   const columns = [
//     {
//       field: "userName",
//       headerName: "User Name",
//       minWidth: 200,
//       flex: 0.5,
//     },
//     { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
//     { field: "orderid", headerName: "Order Number", minWidth: 300, flex: 1 },
//     {
//       field: "status",
//       headerName: "Status",
//       minWidth: 150,
//       flex: 0.5,
//       cellClassName: (params) => {
//         return params.getValue(params.id, "status") === "Delivered"
//           ? "greenColor"
//           : "redColor";
//       },
//     },
//     {
//       field: "itemsQty",
//       headerName: "Items Qty",
//       type: "number",
//       minWidth: 150,
//       flex: 0.4,
//     },
//     {
//       field: "amount",
//       headerName: "Amount",
//       type: "number",
//       minWidth: 270,
//       flex: 0.5,
//     },
    
//     {
//       field: "actions",
//       flex: 0.3,
//       headerName: "Actions",
//       minWidth: 150,
//       type: "number",
//       sortable: false,
//       renderCell: (params) => {
//         return (
//           <Fragment>
//             <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
//               <EditIcon />
//             </Link>

//             <Button
//               onClick={() =>
//                 deleteOrderHandler(params.getValue(params.id, "id"))
//               }
//             >
//               <DeleteIcon />
//             </Button>
//           </Fragment>
//         );
//       },
//     },
//   ];

//   const rows = [];

//   let newOrders = [];
//   let shippedOrders = [];
//   let deliveredOrders = [];

//   orders &&
//     orders.forEach((item) => {
//       let order = {
//         orderid: orderIdCounter++,
//         id: item._id,
//         itemsQty: item.orderItems.length,
//         amount: item.totalPrice,
//         status: item.orderStatus,
//         userName: item.user ? item.user.name : "N/A",
//         createdAt: new Date(item.createdAt)
//       };

//       if (item.orderStatus === "Delivered") {
//         deliveredOrders.push(order);
//       } else if (item.orderStatus === "Shipped") {
//         shippedOrders.push(order);
//       } else {
//         newOrders.push(order);
//       }
//     });

//   newOrders.sort((a, b) => b.createdAt - a.createdAt);
//   shippedOrders.sort((a, b) => b.createdAt - a.createdAt);
//   deliveredOrders.sort((a, b) => b.createdAt - a.createdAt);
//   rows.push(...newOrders, ...shippedOrders, ...deliveredOrders);

//   return (
//     <Fragment>
//       <MetaData title={`ALL ORDERS - Admin`} />

//       <div className="dashboard">
//         <SideBar />
//         <div className="productListContainer">
//           <h1 id="productListHeading">ALL ORDERS</h1>
//           <div style={{ height: 600, width: "100%", overflow: "auto" }}>
//             <DataGrid
//               rows={rows}
//               columns={columns}
//               pageSize={30}
//               disableSelectionOnClick
//               className="productListTable"
//               autoHeight
//             />
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default OrderList;








import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import "./OrderCard.css"
import "./OrderList.css";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import logo from "../../images/logo192.png";

const PaginationControls = ({ page, setPage, pageSize, totalItems }) => {
  const startIndex = page * pageSize + 1;
  const endIndex = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="pagination-controls">
      <button 
        onClick={() => setPage(prev => Math.max(0, prev - 1))} 
        disabled={page === 0}
        className="pagination-button"
      >
        &lt;
      </button>
      <span>{startIndex}-{endIndex} of {totalItems}</span>
      <button 
        onClick={() => setPage(prev => Math.min(Math.ceil(totalItems / pageSize) - 1, prev + 1))} 
        disabled={page >= Math.ceil(totalItems / pageSize) - 1}
        className="pagination-button"
      >
        &gt;
      </button>
    </div>
  );
};


const OrderList = ({ history }) => {
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  let orderIdCounter = 1;

  const alert = useAlert();

  const { error, orders } = useSelector((state) => state.allOrders);

  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
      setIsSidebarOpen(width > 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(!isSidebarOpen); // Only toggle sidebar on small screens
    }
  };

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      history.push("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, history, isDeleted]);

  const columns = [
    {
      field: "userName",
      headerName: "User Name",
      minWidth: 120,
      flex: 0.3,
      headerAlign: 'left',
      align: 'left',
    },


    { field: "orderid",
      headerName: "Order Number",
      minWidth: 100,
      flex: 0.3,
      headerAlign: 'left',
      align: 'left',
     },


    {
      field: "status",
      headerName: "Status",
      minWidth: 40,
      flex: 0.2,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 100,
      flex: 0.2,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 40,
      flex: 0.2,
      headerAlign: 'center',
      align: 'center',

    },
    {
      field: "actions",
      flex: 0.2,
      headerName: "Actions",
      minWidth: 110,
      headerAlign: 'center',
      align: 'center',
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  let newOrders = [];
  let shippedOrders = [];
  let deliveredOrders = [];

  orders &&
    orders.forEach((item) => {
      let order = {

       
      
        orderid: orderIdCounter++,
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
        userName: item.user ? item.user.name : "N/A",
        createdAt: new Date(item.createdAt)
      };

      if (item.orderStatus === "Delivered") {
        deliveredOrders.push(order);
      } else if (item.orderStatus === "Shipped") {
        shippedOrders.push(order);
      } else {
        newOrders.push(order);
      }
    });

  newOrders.sort((a, b) => b.createdAt - a.createdAt);
  shippedOrders.sort((a, b) => b.createdAt - a.createdAt);
  deliveredOrders.sort((a, b) => b.createdAt - a.createdAt);
  rows.push(...newOrders, ...shippedOrders, ...deliveredOrders);

  const OrderCard = ({ order }) => (
    <div className="order-card">
      <h3>Order #{order.orderid}</h3>
      <p>User: {order.userName}</p>
      <p>Status: <span className={order.status === "Delivered" ? "greenColor" : "redColor"}>{order.status}</span></p>
      <p>Items: {order.itemsQty}</p>
      <p>Amount: ₹{order.amount}</p>
      <div className="order-actions">
      <Link to={`/admin/order/${order.id}`} className="order-action-icon">
          <EditIcon />
        </Link>
        <Button onClick={() => deleteOrderHandler(order.id)} className="order-action-icon">
          <DeleteIcon />
        </Button>
      </div>
    </div>
  );

  const paginatedRows = rows.slice(page * pageSize, (page + 1) * pageSize);

  // const PaginationControls = () => {
  //   const startIndex = page * pageSize + 1;
  //   const endIndex = Math.min((page + 1) * pageSize, rows.length);
  //   const totalEntries = rows.length;
  //   return (
  //     <div className="pagination-controls">
  //       <button 
  //         onClick={() => setPage(prev => Math.max(0, prev - 1))} 
  //         disabled={page === 0}
  //         className="pagination-button"
  //       >
  //         &lt;
  //       </button>
  //       <span>{startIndex}-{endIndex} of {totalEntries}</span>
  //       <button 
  //         onClick={() => setPage(prev => Math.min(Math.ceil(rows.length / pageSize) - 1, prev + 1))} 
  //         disabled={page >= Math.ceil(rows.length / pageSize) - 1}
  //         className="pagination-button"
  //       >
  //         &gt;
  //       </button>
  //     </div>
  //   );
  // };

  return (
    <Fragment>
      <MetaData title={`ALL ORDERS - Admin`} />

      <div className={`dashboard ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <img src={logo} alt="Toggle Sidebar" style={{ width: "50px", height: "40px" }} />
        </button>
        {isSidebarOpen && <SideBar />}
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>
          {isMobileView ? (
            <>
              <PaginationControls 
                page={page} 
                setPage={setPage} 
                pageSize={pageSize} 
                totalItems={rows.length} 
              />
              <div className="order-cards-container">
                {paginatedRows.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
              <PaginationControls 
                page={page} 
                setPage={setPage} 
                pageSize={pageSize} 
                totalItems={rows.length} 
              />
            </>
          ) : (
            <div style={{ height: 600, width: "100%", overflow: "auto" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                page={page}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                rowsPerPageOptions={[10]}
                pagination
                disableSelectionOnClick
                className="productListTable"
                autoHeight
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;