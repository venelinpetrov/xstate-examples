import Page from '../components/Page';
import App from 'next/app'

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        pageProps.query = ctx.query;

        return { pageProps };
    }
    render() {
        const { pageProps, Component } = this.props;
        return (
            <Page>
                <Component {...pageProps} />
            </Page>
        )
    }
}

export default MyApp;