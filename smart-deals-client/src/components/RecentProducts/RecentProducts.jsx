import React, { use } from 'react';
import { Link } from 'react-router';

const RecentProducts = ({ recentProductsPromise }) => {
    const recentProducts = use(recentProductsPromise);

    return (
        <div className='m-20'>
            <h1 className='text-center'>Recent Products</h1>
            <div className='grid grid-cols-3 gap-6 my-10'>
                {
                    recentProducts.map(recentProduct => (
                        <div key={recentProduct._id} className='p-4 border rounded-lg'>
                            <img className='border h-70 bg-gray-100 rounded-lg' src={recentProduct.image} alt="" />
                            <h3>{recentProduct.title} [ {recentProduct.condition} Condition ]</h3>
                            <p>$ {recentProduct.price_min}- {recentProduct.price_max}</p>
                            <Link to={`/product-details/${recentProduct._id}`} className='btn w-full'>View Details</Link>
                        </div>
                    ))
                }
            </div>
            <div className='text-center'>
                <Link to='/all-products' className='btn'>Show All</Link>
            </div>
        </div>
    );
};

export default RecentProducts;