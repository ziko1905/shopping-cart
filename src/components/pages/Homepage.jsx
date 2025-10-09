import categoryFilter from "../helper-functions/categoryFilter";
import ShowcaseCard from "../ShowcaseCard";
import PropTypes from "prop-types";

function Homepage({ productList = [], order, orderCallback }) {
  const productsByCategories = categoryFilter(productList);
  const categoriesList = Object.keys(productsByCategories);

  function toUpperCase(s) {
    s = s.split(" ");
    s = s.map((word) => {
      return word.charAt(0).toLocaleUpperCase() + word.slice(1);
    });

    return s.join(" ");
  }
  return (
    <div className="content">
      <h1 className="font-extrabold">Homepage</h1>
      {categoriesList.map((category) => {
        return (
          <div key={category}>
            <h2
              className="col-span-full font-bold text-3xl"
              data-testid="category-heading"
            >
              {toUpperCase(category)}
            </h2>
            <div className="grid [grid-template-columns:repeat(auto-fit,_calc(15rem))] justify-between gap-[2rem] p-[1rem_0] mb-[4rem]">
              {productsByCategories[category].map((id) => (
                <ShowcaseCard
                  order={order}
                  orderCallback={orderCallback}
                  key={id}
                  productObj={productList[id - 1]}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Homepage.propTypes = {
  productList: PropTypes.array,
  order: PropTypes.array,
  orderCallback: PropTypes.func,
};

export default Homepage;
