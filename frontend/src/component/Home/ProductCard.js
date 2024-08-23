// import React from "react";
// import { Link } from "react-router-dom";
// import { Rating } from "@material-ui/lab";

// const ProductCard = ({ product }) => {
//   const options = {
//     value: product.ratings,
//     readOnly: true,
//     precision: 0.5,
//   };
//   return (
//     <div>
//       <h1>hello</h1>
//       <Link className="productCard" to={`/product/${product._id}`}>
//       <img src={product.images[0].url} alt={product.name} />
//       <p>{product.name}</p>
//       <div>
//         <Rating {...options} />{" "}
//         <span className="productCardSpan">
//           {" "}
//           ({product.numOfReviews} Reviews)
//         </span>
//       </div>
//       <span>{`₹${product.price}`}</span>
//     </Link>
    
//     </div>
    
    
//   );
// };

// export default ProductCard;

import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { addItemsToCart } from "../../actions/cartAction";
import { useAlert } from "react-alert";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const options = {
    value: product.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  const addToCartHandler = (e) => {
    e.preventDefault(); 
    dispatch(addItemsToCart(product._id, 1));
    alert.success("Item Added To Cart");
  };

  return (
    <div className="productCardContainer">
      <Link
        className="productCard"
        to={`/product/${product._id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={product.images[0]?.url} alt={product.name} />
        <p>{product.name}</p>
        <div>
          <Rating {...options} />{" "}
          <span className="productCardSpan">
            {`(${product.numOfReviews || 0} Reviews)`}
          </span>
        </div>
        <div className="productCardBottom">
          <span>{`₹${product.price || 0}`}</span>
          <button className="addToCartBtn" onClick={addToCartHandler}>
            Add
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
