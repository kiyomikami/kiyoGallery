import "../styles/globals.scss";
import Layout from "./components/layout";
import Header from "./components/header";

function MyApp({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <Layout>
        <Header />
        {page}
      </Layout>
    ));
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
