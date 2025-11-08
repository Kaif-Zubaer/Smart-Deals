import React from 'react';
import { Link } from 'react-router';

const Banner = () => {
    return (
        <div className='flex flex-col justify-center items-center gap-3 border-b py-18'>
            <h1 className='text-center'>
                Deal your Products <br />in a Smart way !
            </h1>
            <p>SmartDeals helps you sell, resell, and shop from trusted local sellers — all in one place!</p>
            <label className="input">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input type="search" required placeholder="Search" />
            </label>
            <div className='flex gap-4'>
                    <Link to='/all-products' className='btn'>Watch All Products</Link>
                    <Link to='/create-product' className='btn'>Post an Product</Link>
                </div>
        </div>
    );
};

export default Banner;