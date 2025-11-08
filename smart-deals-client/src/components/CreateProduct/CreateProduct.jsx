// import axios from 'axios';
import React from 'react';
import { Link } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
// import useAuth from '../../hooks/useAuth';
// import useAxios from '../../hooks/useAxios';

const CreateProduct = () => {
    // const { user } = useAuth;
    // const axiosInstane = useAxios();
    const axiosSecure = useAxiosSecure();

    const handleCreateProduct = (e) => {
        e.preventDefault();

        const from = e.target;

        const title = from.title.value;
        const price_min = from.min_price.value;
        const price_max = from.max_price.value;
        const image = from.image.value;
        const seller_name = from.seller_name.value;
        const email = from.seller_email.value;
        const seller_contact = from.seller_contact.value;
        const seller_image = from.seller_image.value;
        const location = from.location.value;

        // console.log(title, price_min, price_max, image, seller_name, email, seller_contact, seller_image, location);

        const newProduct = { title, price_max, price_min, image, seller_name, email, seller_contact, seller_image, location };

        // axios.post('https://smart-deals-eight.vercel.app/products', newProduct)
        //     .then(data => {
        //         console.log(data.data);

        //         if (data.data.insertedId) {
        //             alert('Product added successfully');
        //         }
        //     })

        // axiosInstane.post('/products', newProduct)
        //     .then(data => {
        //         console.log(data.data);
        //     })

        axiosSecure.post('/products', newProduct)
            .then(data => {
                console.log('after secure:', data.data);
            })
    }

    return (
        <div>
            <Link to='/all-products'>Back to Products</Link>
            <h1 className='text-center'>Create a Product</h1>
            <form onSubmit={handleCreateProduct} className='flex flex-col justify-center items-center'>
                <div className='flex gap-8'>
                    <div className='flex flex-col'>
                        <label>Title</label>
                        <input type="text" name='title' placeholder='e.g. Yamaha Fz Guitar for Sale' />
                    </div>
                </div>
                <div className='flex gap-8'>
                    <div className='flex flex-col'>
                        <label>Min Price You want to Sale ($)</label>
                        <input type="text" name='min_price' placeholder='e.g. 18.5' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Max Price You want to Sale ($)</label>
                        <input type="text" name='max_price' placeholder='Optional (default = Min Price)' />
                    </div>
                </div>
                <label>Your Product Image URL</label>
                <input type="text" name='image' placeholder='https://...' />
                <div className='flex gap-8'>
                    <div className='flex flex-col'>
                        <label>Seller Name</label>
                        <input type="text" name='seller_name' placeholder='Seller name' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Seller Email</label>
                        <input type="email" name="seller_email" placeholder='Seller email' />
                    </div>
                </div>
                <div className='flex gap-8'>
                    <div className='flex flex-col'>
                        <label>Seller Contact</label>
                        <input type="text" name='seller_contact' placeholder='e.g. +1-555-1234' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Seller Image URL</label>
                        <input type="text" name="seller_image" placeholder='https://...' />
                    </div>
                </div>
                <label>Location</label>
                <input type="text" name='location' placeholder='City, Country' />
                <div className='flex'>
                    <button className="btn w-fit" type='submit'>Create a Product</button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;