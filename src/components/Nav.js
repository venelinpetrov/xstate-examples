import Link from 'next/link';
import styled from 'styled-components';

const StyledNav = styled.nav`
    a {
        padding: 10px;
        background: skyblue;
    }
`;

const Nav = () => (
    <StyledNav>
        <Link href="/">
            <a>Home</a>
        </Link>
        <Link href="/data-loading">
            <a>Data Loading</a>
        </Link>
        <Link href="/video-player">
            <a>Video Player</a>
        </Link>
    </StyledNav>
)

export default Nav;
