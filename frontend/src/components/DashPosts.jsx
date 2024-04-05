import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Modal, Table, Button } from 'flowbite-react';
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  // Redux state
  const { currentUser } = useSelector((state) => state.user);

  // Local state for user posts
  const [userPosts, setUserPosts] = useState([]);

  // show more state

  const [showMore, setShowMore ] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  // Fetch user posts on component mount or when currentUser changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/backend/post/getposts?userId=${currentUser._id}`);
        if (res.ok) {
          const data = await res.json();
          setUserPosts(data.posts);
          if(data.posts.length < 9){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // Fetch posts only if user is admin
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/backend/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9){
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error.message)

    }
  };

  const handleDeletePost  = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/backend/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method:'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
        prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
      <>
        <Table hoverable className="shadow-md">
          {/* Table Headings */}
          <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Post image</Table.HeadCell>
            <Table.HeadCell>Post title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell><span>Edit</span></Table.HeadCell>
          </Table.Head>

          {/* Table Body */}
          <Table.Body className="divide-y">
            {userPosts.map((post, index) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                {/* Date updated */}
                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>

                {/* Post image */}
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>

                {/* Post title */}
                <Table.Cell>
                  <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>{post.title}</Link>
                </Table.Cell>

                {/* Category */}
                <Table.Cell>{post.category}</Table.Cell>

                {/* Delete */}
                <Table.Cell>
                  <span onClick={() => {
                    setShowModal(true);
                    setPostIdToDelete(post._id);
                  }}
                   className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                </Table.Cell>

                {/* Edit */}
                <Table.Cell>
                  <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                    <span>Edit</span>
                  </Link>
                </Table.Cell>
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
        <p>You have no posts yet!</p>
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
                    Are you sure you want to delete this post ?
                </h3>
                <div className='flex justify-center gap-4'>
                    <Button color='failure' onClick={handleDeletePost}>
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
