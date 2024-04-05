
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Modal, Table, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {FaCheck, FaTimes} from 'react-icons/fa';

export default function DashUsers() {
  // Redux state
  const { currentUser } = useSelector((state) => state.user);

  // Local state for user posts
  const [users, setUsers] = useState([]);

  // show more state

  const [showMore, setShowMore ] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  // Fetch user posts on component mount or when currentUser changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/backend/user/getusers`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
          if(data.users.length < 9){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // Fetch posts only if user is admin
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/backend/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9){
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error.message)

    }
  };

 //handle delete later
 const handleDeleteUser = async() => {
    try {
        const res = await fetch(`/backend/user/delete/${userIdToDelete}`,{
            method:'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
            setShowModal(false);
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error.message);
    }
 };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
      <>
        <Table hoverable className="shadow-md">
          {/* Table Headings */}
          <Table.Head>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>User image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {/* Table Body */}
          <Table.Body className="divide-y">
            {users.map((user, index) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                {/* Date updated */}
                <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>

                {/* Post image */}
                <Table.Cell>
                    <img 
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                </Table.Cell>

                {/* Post title */}
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.isAdmin ?(<FaCheck className="text-green-500"/>):(<FaTimes className="text-red-500"/>)}</Table.Cell>

                {/* Delete */}
                <Table.Cell>
                  <span onClick={() => {
                    setShowModal(true);
                    setUserIdToDelete(user._id);
                  }}
                   className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                </Table.Cell>

                {/* Edit */}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {showMore && (
          <button className="w-full text-teal-500 self-center text-sm py-2" onClick={handleShowMore}>
            Show More
          </button>
        )}
     </>   
      ) : (
        <p>You have no users yet!</p>
      )}

            <Modal
       show={showModal}
       onClose={() => setShowModal(false)}
       popup
       size='md'>
        <Modal.Header/>
        <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle  className='h-14 w-14 text-gray-400 
                dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                    Are you sure you want to delete this user ?
                </h3>
                <div className='flex justify-center gap-4'>
                    <Button color='failure' onClick={handleDeleteUser}>
                        Yes, I am sure
                    </Button>
                    <Button color='gray' onClick={()=> setShowModal(false)}>
                        No, cancel
                    </Button>
                </div>
            </div>
        </Modal.Body>
       </Modal>
    </div>
  );
}
