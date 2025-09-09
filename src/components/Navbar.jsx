import { Link } from "react-router-dom";
import cartSrc from "../assets/cart-outline.svg";
import PropTypes from "prop-types";

function Navbar({ itemsNum }) {
  return (
    <div className="flex justify-end items-center h-20 gap-12 bg-[#3e64ce] pr-40 py-2 sticky top-0">
      <Link to="/" className="text-[2rem] text-white">
        Homepage
      </Link>
      <ShoppingCartIcon itemsNum={itemsNum} />
    </div>
  );
}

function ShoppingCartIcon({ itemsNum = 0 }) {
  return (
    <Link to="/shopping-cart" className="grid relative h-full">
      <img
        className="h-[calc(100%_-_1rem)] self-center filter-(--white-filter)"
        src={cartSrc}
        alt="Shopping cart displaying amount of items in cart"
      />
      {!!itemsNum && (
        <div
          className="absolute bottom-[0.4rem] right-[-0.4rem] bg-red-400 px-1 rounded-sm text-white"
          aria-label="Number of items in cart"
        >
          {itemsNum < 10 ? (
            <span className="font-semibold">{itemsNum}</span>
          ) : (
            <span>{"+9"}</span>
          )}
        </div>
      )}
    </Link>
  );
}

Navbar.propTypes = {
  itemsNum: PropTypes.number,
};

ShoppingCartIcon.propTypes = {
  itemsNum: PropTypes.number,
};

export default Navbar;
