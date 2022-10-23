import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Suciu M. Repairs!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Beautiful Downtown Foo City, Suciu M. Repairs provides a
          trained staff ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          Suciu M. Repairs
          <br />
          555 Foo Drive
          <br />
          Foo City, CA 12345
          <br />
          <a href="tel:+15555555555">(555) 555-5555</a>
        </address>
        <br />
        <p>Owner: Suciu Marius</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
  return content;
};
export default Public;
