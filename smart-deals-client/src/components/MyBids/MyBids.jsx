import React, { use, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyBids = () => {
    const { user } = use(AuthContext);
    const [myBids, setMyBids] = useState([]);
    const products = useLoaderData();
    const axiosSecure = useAxiosSecure();

    // useEffect(() => {
    //     if (user?.email) {
    //         fetch(`http://localhost:3000/bids?email=${user.email}`)
    //             .then(res => res.json())
    //             .then(data => {
    //                 // console.log(data);

    //                 setMyBids(data);
    //             })
    //     }
    // }, [user])

    useEffect(() => {
        axiosSecure.get(`/bids?email=${user.email}`)
            .then(data => {
                setMyBids(data.data);
            })
    }, [user, axiosSecure])

    const handleRemoveBid = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Remove it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3000/bids/${_id}`, {
                    method: 'DELETE',
                })
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data);

                        if (data.deletedCount) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your bid has been removed.",
                                icon: "success"
                            });

                            const remainingBids = myBids.filter(bid => bid._id !== _id);
                            setMyBids(remainingBids);
                        }
                    })
            }
        });
    }

    return (
        <div className='mx-20'>
            <h1 className='text-center'>My Bids: {myBids.length}</h1>
            <div>
                <table className='w-full'>
                    <thead className='text-left'>
                        <tr>
                            <th>SL No</th>
                            <th>Product</th>
                            <th>Seller</th>
                            <th>Bid Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            myBids.map((myBid, index) => {
                                const product = products.find(p => p._id === myBid.product);

                                return (
                                    <tr key={myBid._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className='flex items-center'>
                                                <img className='boreder w-15 h-10 ' src={product.image} alt="" />
                                                <div>
                                                    <p>{product.title}</p>
                                                    <p>${product.price_min}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='flex items-center'>
                                                <img className='border w-10 h-10 rounded-4xl' src={product.seller_image} alt="" />
                                                <div>
                                                    <p>{product.seller_name}</p>
                                                    <p>{product.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{myBid.bid_price}</td>
                                        <td>
                                            {
                                                myBid.status === 'pending'
                                                    ? <div className="badge badge-warning">{myBid.status}</div>
                                                    : <div className="badge badge-success">{myBid.status}</div>
                                            }
                                        </td>
                                        <td><button onClick={() => handleRemoveBid(myBid._id)} className='btn'>Remove Bid</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBids;