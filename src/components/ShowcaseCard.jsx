import { useState } from "react";
import Card from "./Card.jsx";
import PropTypes from "prop-types";

function ShowcaseCard({ productObj, orderCallback, order }) {
  const [amount, setAmount] = useState(1);
  const addToCartBtn = {
    text: "Add To Cart",
    onClick: () =>
      handleOrderUpdate({
        productObj,
        productId: productObj.id,
        amount: amount,
      }),
  };

  function handleAmountChange(newAmount) {
    if (newAmount < 1 || isNaN(+newAmount)) return;
    else setAmount(Math.floor(newAmount));
  }

  function handleOrderUpdate(obj) {
    const oldOrderElem = order.filter(
      (order) => order.productId === obj.productId,
    )[0];
    if (oldOrderElem) {
      oldOrderElem.amount += obj.amount;
      orderCallback(order);
    } else {
      orderCallback([...order, obj]);
    }
  }

  return (
    <div className="p-[2rem_1rem] grid grid-rows-1 bg-blue-50 shadow-md align-content-end">
      <Card
        productObj={productObj}
        amountCallback={handleAmountChange}
        amount={amount}
        addOnBtns={[addToCartBtn]}
      />
    </div>
  );
}

ShowcaseCard.propTypes = {
  productObj: PropTypes.object.isRequired,
  orderCallback: PropTypes.func.isRequired,
  order: PropTypes.array,
};

export default ShowcaseCard;
