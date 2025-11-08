import React from 'react';
import Banner from '../Banner/Banner';
import RecentProducts from '../RecentProducts/RecentProducts';

const recentProductsPromise = fetch('http://localhost:3000/recent-products')
    .then(res => res.json())

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <RecentProducts recentProductsPromise={recentProductsPromise}></RecentProducts>
        </div>
    );
};

export default Home;