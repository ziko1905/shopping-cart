import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function Checkout({ error, orderCallback }) {
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!error) orderCallback([]);
    else setErrorMsg(error);
  }, []);

  return (
    <div
      className={
        !errorMsg
          ? "bg-teal-400 inline-flex absolute p-12 py-3 m-0 mx-auto top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          : "bg-red-600 inline-flex absolute p-12 py-3 m-0 mx-auto top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      }
    >
      <h3 className="text-white font-semibold text-lg">
        {!errorMsg ? "Thank you for your purchase!" : errorMsg}
      </h3>
    </div>
  );
}

Checkout.propTypes = {
  error: PropTypes.string,
  orderCallback: PropTypes.func,
};

export default Checkout;
