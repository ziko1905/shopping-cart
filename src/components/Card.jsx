import prettyPrice from "./helper-functions/prettyPrice";
import PropTypes from "prop-types";

function Card({ productObj, amountCallback, amount = 0, addOnBtns = [] }) {
  const title = productObj.title;
  const src = productObj.image;
  const buttons = [];
  addOnBtns.forEach((btn) => buttons.push(btn));

  return (
    <>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <img
        className="product-image mx-auto mb-4 max-w-full h-auto"
        alt={"Image of the item"}
        src={src}
      ></img>
      <div className="grid grid-cols-3 gap-1.5 mt-8 mb-4 items-center justify-center">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
          onClick={() => amountCallback(amount - 1)}
          aria-label="Decrement amount by one"
        >
          -
        </button>
        <input
          className="text-center border-t border-b border-gray-300 py-2 px-4 w-full"
          onChange={(e) => amountCallback(e.target.value)}
          value={amount}
          aria-label="Input for changing amount with current amount"
          type="text"
        />
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
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
          <button
            {...props}
            key={i}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 w-full"
          >
            {btn.text}
          </button>
        );
      })}
      <p className="mt-4 text-lg font-medium" aria-label="Item price">
        Price: {prettyPrice(productObj.price)}$
      </p>
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
