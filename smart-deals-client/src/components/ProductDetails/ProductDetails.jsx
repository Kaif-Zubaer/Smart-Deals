import React, { use, useEffect, useRef, useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

const ProductDetails = () => {
    const { user } = use(AuthContext);
    const productDetails = useLoaderData();
    const bidModalRef = useRef(null);
    const [bids, setBids] = useState([]);
    // console.log(productDetails);

    const {
        _id,
        title,
        price_min,
        price_max,
        email,
        category,
        created_at,
        image,
        status,
        location,
        seller_image,
        seller_name,
        condition,
        usage,
        description,
        seller_contact
    } = productDetails;

    useEffect(() => {
        fetch(`http://localhost:3000/products/bids/${_id}`, {
            headers: {
                authorization: `Bearer ${user.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setBids(data);
            })
    }, [_id, user])

    const handleBidModalOpen = () => {
        bidModalRef.current.showModal();
    }

    const handleBidModalClose = () => {
        bidModalRef.current.close();
    }

    const handleBidSubmit = e => {
        e.preventDefault();

        const from = e.target;

        const name = from.name.value;
        const email = from.email.value;
        const image = from.image.value
        const price = from.price.value;
        const contact = from.contact.value;
        // console.log(name, email, image, price, contact);

        const newBid = {
            product: _id,
            buyer_image: image,
            buyer_name: name,
            buyer_contact: contact,
            buyer_email: email,
            bid_price: Number(price),
            status: 'pending',
        }

        fetch('http://localhost:3000/bids', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(newBid),
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    // console.log('AFTER PALCING BID:', data);

                    newBid._id = data.insertedId;
                    const newBids = [...bids, newBid];
                    newBids.sort((x, y) => y.bid_price - x.bid_price);
                    setBids(newBids);

                    bidModalRef.current.close();
                }
            })

        from.reset();

    }

    return (
        <div className='mx-20'>
            <div className='flex gap-10'>
                <div className='w-1/2'>
                    <img src={image} alt="" />
                    <h3>Product Description</h3>
                    <div>
                        <p><span>Condition :</span> {condition}</p>
                        <p><span>Usage Time :</span> {usage}</p>
                    </div>
                    <p>{description}</p>
                </div>
                <div className='w-1/2'>
                    <Link to='/all-products'>Back to Products</Link>
                    <h1>{title}</h1>
                    <p>{category}</p>
                    <div>
                        <h3>${price_min} - {price_max}</h3>
                        <p>Price starts from </p>
                    </div>
                    <div>
                        <h3>Product Details</h3>
                        <p><span>Product ID: </span>{_id}</p>
                        <p><span>Posted: </span>{created_at}</p>
                    </div>
                    <div>
                        <h3>Seller Information</h3>
                        <div className='flex gap-4'>
                            <img className='border w-14 h-14 rounded-4xl' src={seller_image} alt="" />
                            <div>
                                <p>{seller_name}</p>
                                <p>{email}</p>
                            </div>
                        </div>
                        <p><span>Location: </span>{location}</p>
                        <p><span>Contact: </span>{seller_contact}</p>
                        <p><span>Status: </span><span>{status}</span></p>
                    </div>
                    <button onClick={handleBidModalOpen} className='btn w-full'>Bid</button>
                    <dialog ref={bidModalRef} className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg text-center">Give Seller Your Offered Price</h3>
                            <form onSubmit={handleBidSubmit} className='flex flex-col'>
                                <div className='flex '>
                                    <div>
                                        <label>Buyer Name</label>
                                        <input type="text" name='name' placeholder='Your name' defaultValue={user.displayName} readOnly />
                                    </div>
                                    <div>
                                        <label>Buyer Email</label>
                                        <input type="email" name="email" placeholder='Your email' defaultValue={user.email} readOnly />
                                    </div>
                                </div>
                                <label>Buyer Image URL</label>
                                <input type="text" name='image' placeholder='https://...your_img_url' defaultValue={user.photoURL} readOnly />
                                <label>Place your Price</label>
                                <input type="text" name='price' placeholder='Enter your price' />
                                <label>Contact Info</label>
                                <input type="text" name='contact' placeholder='e.g. +1-555-1234' />
                                <div className='flex justify-end'>
                                    <button onClick={handleBidModalClose} className='btn w-fit' type='button'>Cancel</button>
                                    <button className="btn w-fit" type='submit'>Submit Bid</button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                    <button className='btn w-full'>Product to Wishlist</button>
                </div>
            </div>
            <div>
                <h1>Bids For This Product: {bids.length}</h1>
                <div>
                    <table className='w-full'>
                        <thead className='text-left'>
                            <tr>
                                <th>SL No</th>
                                <th>Product</th>
                                <th>Buyer</th>
                                <th>Bid Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bids.map((bid, index) => (
                                    <tr key={bid._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className='flex items-center'>
                                                <img className='boreder w-15 h-10 ' src={image} alt="" />
                                                <div>
                                                    <p>{title}</p>
                                                    <p>{price_min}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='flex items-center'>
                                                <img className='border w-10 h-10 rounded-4xl' src={bid.buyer_image} alt="" />
                                                <div>
                                                    <p>{bid.buyer_name}</p>
                                                    <p>{bid.buyer_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{bid.bid_price}</td>
                                        <td>

                                            {
                                                bid.status === 'pending'
                                                    ? <div className="badge badge-warning">{bid.status}</div>
                                                    : <div className="badge badge-success">{bid.status}</div>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;