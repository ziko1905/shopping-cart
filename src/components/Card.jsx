import prettyPrice from "./helper-functions/prettyPrice";
import "../styles/Card.css";
import PropTypes from "prop-types";

function Card({ productObj, amountCallback, amount = 0, addOnBtns = [] }) {
  const title = productObj.title;
  const src = productObj.image;
  const buttons = [];
  addOnBtns.forEach((btn) => buttons.push(btn));

  return (
    <>
      <h3>{title}</h3>
      <img className="product-image" alt={"Image of the item"} src={src}></img>
      <div className="amount-div">
        <button
          onClick={() => amountCallback(amount - 1)}
          aria-label="Decrement amount by one"
        >
          -
        </button>
        <input
          onChange={(e) => amountCallback(e.target.value)}
          value={amount}
          aria-label="Input for changing amount with current amount"
          type="text"
        />
        <button
          onClick={() => amountCallback(amount + 1)}
          aria-label="Increment amount by one"
        >
          +
        </button>
      </div>
      {buttons.map((btn, i) => {
        const props = { ...btn };
        delete props.text;
        return (
          <button {...props} key={i}>
            {btn.text}
          </button>
        );
      })}
      <p aria-label="Item price">Price: {prettyPrice(productObj.price)}$</p>
    </>
  );
}

Card.propTypes = {
  productObj: PropTypes.object.isRequired,
  amountCallback: PropTypes.func.isRequired,
  amount: PropTypes.number,
  addOnBtns: PropTypes.array,
  text: PropTypes.string,
};

export default Card;
