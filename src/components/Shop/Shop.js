import React, { useEffect, useState } from 'react';
import './Shop.css';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, getShoppingCart } from '../../utilities/localStorageAdd';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('products.json')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);

    // to show added/storedItems in order summary
     useEffect(() => {
         const storedCart = getShoppingCart();
         let savedCart = [];
         for (const storedId in storedCart) {
             const addedProduct = products.find(product => product.id === storedId);
             if (addedProduct) {
                 const quantity = storedCart[storedId];
                 addedProduct.quantity = quantity;
                 savedCart.push(addedProduct);
             }
         }
         setCart(savedCart);
 
     }, [products])

    const handleAddToCart = clickedProduct => {
        let newCart = [];
        const exists = cart.find(product => product.id === clickedProduct.id);
        if (!exists) {
            clickedProduct.quantity = 1;
            newCart = [...cart, clickedProduct];
        } else {
            const rest = cart.filter(product => product.id !== clickedProduct.id);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, exists];
        }

        setCart(newCart);
        addToDb(clickedProduct.id);
    }

    return (
        <div className='shop-container '>
            <div className="product-container grid grid-cols-3 justify-evenly p-5 ml-32 gap-32 " style={{ 'margin': '100px' }}>
                {
                    products.map(product => <Product
                        key={product.id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="order-container ml-10" style={{ 'backgroundColor': '#EBD8D1' }}>
                {/*  style={{ 'backgroundColor': '#f7c5c7' }} */}
                <Cart cart={cart}>  </Cart>
            </div>
        </div>
    );
};

export default Shop;