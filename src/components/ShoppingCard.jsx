import Card from "./Card";
import styles from "../styles/ShoppingCard.module.css";
import PropTypes from "prop-types";

function ShoppingCard({ productObj, orderCallback, amount, order = [] }) {
  const removalBtn = {
    text: "Remove",
    className: styles["remove-btn"],
    onClick: handleRemoval,
  };

  function handleOrderUpdate(newAmount) {
    if (newAmount > 0) {
      order.forEach((obj) => {
        if (obj.productId === productObj.id) obj.amount = +newAmount;
      });
    }
    orderCallback([...order]);
  }

  function handleRemoval() {
    orderCallback(order.filter((obj) => obj.productId !== productObj.id));
  }

  return (
    <div className={styles.card}>
      <Card
        productObj={productObj}
        amount={amount}
        amountCallback={handleOrderUpdate}
        addOnBtns={[removalBtn]}
      />
    </div>
  );
}

ShoppingCard.propTypes = {
  productObj: PropTypes.object.isRequired,
  orderCallback: PropTypes.func.isRequired,
  amount: PropTypes.number,
  order: PropTypes.array,
};

ShoppingCard.propTypes = {
  productObj: PropTypes.object.isRequired,
  orderCallback: PropTypes.func.isRequired,
  amount: PropTypes.string || PropTypes.number,
  order: PropTypes.array,
};

export default ShoppingCard;
