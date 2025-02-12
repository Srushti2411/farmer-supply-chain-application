import React, { useState, useEffect } from "react";
import axios from 'axios';
import './AdminDashboard.css';
import ItemCard from "../../components/AdminItemCard/ItemCard";
import AddItem from "../../components/AdminAddItem/AdminAddItem";
import ContactCard from "../../components/AdminContactCard/AdminContactCard";
import OrderCard from "../../components/AdminOrderCard/AdminOrderCard";
import AddIcon from "./add-icon.png";
import Profile from "./user.png";
import Mobile from "./mobile.png";
import Laptop from "./laptop.png";
import Tablet from "./tablet.png";
import Contact from "./contact.png";
import Review from "./review.png";
import toast from 'react-hot-toast';

function AdminDashboard() {

  const [activeTab, setActiveTab] = useState("login");
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [users, setUsers] = useState([]);

  const [activeComponent, setActiveComponent] = useState("orderInformation");
  const [orders, setOrders] = useState([]);
  const [mobiles, setMobiles] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [tablets, setTablets] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [addItem, setAddItem] = useState("");

  const loadItems = async () => {
    try {
      const responseA = await axios.get(`${process.env.REACT_APP_API_URL}/admin`);
      const responseO = await axios.get(`${process.env.REACT_APP_API_URL}/order`);
      const responseM = await axios.get(`${process.env.REACT_APP_API_URL}/mobile`);
      const responseL = await axios.get(`${process.env.REACT_APP_API_URL}/laptop`);
      const responseT = await axios.get(`${process.env.REACT_APP_API_URL}/tablet`);
      const responseC = await axios.get(`${process.env.REACT_APP_API_URL}/contact`);
      const responseR = await axios.get(`${process.env.REACT_APP_API_URL}/review`);

      setUsers(responseA.data.data || []);
      setOrders(responseO.data.data || []);
      setMobiles(responseM.data.data || []);
      setLaptops(responseL.data.data || []);
      setTablets(responseT.data.data || []);
      setContacts(responseC.data.data || []);
      setReviews(responseR.data.data || []);
    } catch (error) {
      console.error("Error loading items:", error);
      toast.error("Failed to load data. Please try again.");
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const login = () => {
    if (loginUser === "" || loginPass === "") {
      toast('Enter user name and password', { icon: '➕' });
      return;
    }

    const userFound = users.find((userdata) => userdata.user === loginUser);

    if (!userFound) {
      toast.error("User not found");
    } else if (userFound.pass !== loginPass) {
      toast.error("Incorrect password");
    } else {
      toast.success("Successfully Logged In");
      setActiveTab("main");
    }
  }

  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="body">
      {activeTab === "login" && (
        <div className="container pt-4">
          <div className='col-12 col-sm-5 card m-auto shadow p-4 mt-5'>
            <h3 className="text-center mb-3">Admin Login</h3><hr />
            <input type='text'
              placeholder='example123'
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              className='mb-4 p-2 px-3 rounded border border-black w-100' />

            <input type='password'
              placeholder='********'
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              className='mb-3 p-2 px-3 rounded border border-black w-100' />

            <button type='button' onClick={login} className="w-100 mt-2 py-2 rounded border bag">Login</button>
          </div>
        </div>
      )}

      {activeTab === "main" && (
        <div>
          <h1 className="text-center p-3 bg-dark text-white">नमस्ते 🙏 Admin</h1>
          <div className="m-3 mx-4">
            <div className='row'>
              <div className='col-3 pt-3 shadow rounded-4 bg-dark text-white menu-box-1 d-none d-md-block'>
                <div className="fs-5 m-2 my-3 p-2 px-4 rounded-4 cursor-pointer dash-item"
                  onClick={() => handleSetActiveComponent("orderInformation")}>Order Information</div>
                <div className="fs-5 m-2 my-3 p-2 px-4 rounded-4 cursor-pointer dash-item"
                  onClick={() => handleSetActiveComponent("mobileInformation")}>Mobile Information</div>
              </div>
              <div className={`col-12 col-md-9 ${activeComponent ? "active" : ""}`}>
                <div className="shadow w-100 rounded-4 border menu-box-2">
                  {activeComponent === "orderInformation" && (
                    <div>
                      <h1 className="text-center pt-2">Order Information</h1><hr />
                      <div className="container">
                        {
                          orders.map((order) => (
                            <OrderCard key={order._id} {...order} loadItems={loadItems} />
                          ))
                        }
                      </div>
                    </div>
                  )}
                  {activeComponent === "mobileInformation" && (
                    <div>
                      <h1 className="text-center pt-2">Mobile Information</h1><hr />
                      <div className="container d-flex flex-wrap justify-content-between">
                        {
                          mobiles.map((mobile) => (
                            <ItemCard key={mobile._id} {...mobile} loadItems={loadItems} type={"mobile"} />
                          ))
                        }
                        <img src={AddIcon}
                          className="position-fixed add-icon shadow-lg border border-dark-subtle p-2 rounded-circle"
                          onClick={() => {
                            handleSetActiveComponent("addItem");
                            setAddItem("mobile");
                          }} />
                      </div>
                    </div>
                  )}
                  {activeComponent === "addItem" && (
                    <AddItem type={addItem} loadItems={loadItems} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard;
