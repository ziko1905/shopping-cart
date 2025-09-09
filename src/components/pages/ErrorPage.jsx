import styles from "../../styles/ErrorPage.module.css";

function ErrorPage() {
  return (
    <div className={styles["error-div"]}>
      <h1>Ups, something went wrong.</h1>
      <p>
        An error occurred while trying to load your page. Try again by going to
        homepage!
      </p>
    </div>
  );
}

export default ErrorPage;
