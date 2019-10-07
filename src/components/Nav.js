import Link from 'next/link';

const Nav = props => (
    <nav>
        <Link href="/">
            <a>Home</a>
        </Link>
        <Link href="/data-loading">
            <a>Data Loading</a>
        </Link>
        <Link href="/video-player">
            <a>Video Player</a>
        </Link>
    </nav>
)

export default Nav;
