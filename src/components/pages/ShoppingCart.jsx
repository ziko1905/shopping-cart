import { useNavigate } from "react-router-dom";
import ShoppingCard from "../ShoppingCard.jsx";
import prettyPrice from "../helper-functions/prettyPrice.js";
import styles from "../../styles/ShoppingCart.module.css";
import PropTypes from "prop-types";

function ShoppingCart({ order, orderCallback }) {
  const navigate = useNavigate();

  function calculatePrice() {
    let price = 0;
    order.forEach((ord) => (price += +ord.productObj.price * ord.amount));

    return prettyPrice(price);
  }

  function handleCheckout() {
    const props = ["/checkout"];

    navigate(...props);
  }

  return (
    <div className="content">
      <h1>Shopping Cart</h1>
      <div className={styles["cart-div"]}>
        {!!order.length &&
          order.map((card) => {
            return (
              <ShoppingCard
                orderCallback={orderCallback}
                key={card.productObj.id}
                amount={card.amount}
                productObj={card.productObj}
                order={order}
              />
            );
          })}
        {!order.length && (
          <h3 className={styles["cart-msg"]}>Shopping cart is empty</h3>
        )}
      </div>
      <div>
        <p className={styles.price} aria-label="Order price">
          Order total: {calculatePrice()}$
        </p>
      </div>
      <button className={styles["proceed-div"]} onClick={handleCheckout}>
        Proceed To Checkout
      </button>
    </div>
  );
}

ShoppingCart.propTypes = {
  order: PropTypes.array,
  orderCallback: PropTypes.func,
};

export default ShoppingCart;
