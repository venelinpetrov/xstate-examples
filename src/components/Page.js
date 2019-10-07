import Nav from './Nav';

const Page = props => (
    <div>
        <Nav />
        {props.children}
    </div>
);

export default Page;