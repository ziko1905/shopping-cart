import Navbar from "./components/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/App.css";
import Homepage from "./components/pages/Homepage";
import ShoppingCart from "./components/pages/ShoppingCart";
import ErrorPage from "./components/pages/ErrorPage.jsx";
import Checkout from "./components/pages/Checkout.jsx";
import PropTypes from "prop-types";

function App({ productListUrl = "https://fakestoreapi.com/products/" }) {
  const [order, setOrder] = useState([]);
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();
  const checkoutError = getCheckoutError();

  useEffect(() => {
    fetch(productListUrl)
      .then((response) => {
        if (response.status >= 400) {
          navigate("/error-page");
        }

        return response.json();
      })
      .then((response) => setProductList(response))
      .catch(() => {
        navigate("/error-page");
      });
  }, []);

  function getCheckoutError() {
    const error = checkoutErrorList.find((err) => err.check(order));
    return error ? error.getError() : null;
  }

  return (
    <>
      <Navbar itemsNum={order.length} />
      <Routes>
        <Route
          path="/"
          element={
            <Homepage
              orderCallback={setOrder}
              order={order}
              productList={productList}
            />
          }
        />
        <Route
          path="shopping-cart"
          element={<ShoppingCart orderCallback={setOrder} order={order} />}
        />
        <Route path="*" element={<ErrorPage />} />
        <Route
          path="checkout"
          element={<Checkout orderCallback={setOrder} error={checkoutError} />}
        />
      </Routes>
    </>
  );
}

class EmptyOrderCheckoutError {
  static check(order) {
    if (!order.length) return true;
    return false;
  }
  static getError() {
    return "Error: Can't checkout on empty order.";
  }
}

const checkoutErrorList = [EmptyOrderCheckoutError];

App.propTypes = {
  productListUrl: PropTypes.string,
};

export default App;
