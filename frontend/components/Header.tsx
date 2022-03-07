import Link from 'next/link';
import styled from 'styled-components';
import React from 'react';
import Button from './Button';
import { NavLink } from '../constants/types';

type HeaderProps = {
  navs: NavLink[];
};

const Header: React.FC<HeaderProps> = ({ ...props }) => {
  const navs = props.navs;

  const items = navs.map((item) => (
    <Link href={item.path} key={item.name}>
      <Button buttonText={item.name} />
    </Link>
  ));

  return (
    <HeaderWrapper>
      <Logo>
        <Link href={'/'}>TripPlanr</Link>
      </Logo>
      <Items>{items}</Items>
    </HeaderWrapper>
  );
};

export default Header;

/* Styles */

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 16px 20px;
  box-shadow: rgb(33 33 33 / 15%) 0px 1px 2px;
  min-width: 100%;
`;

const Logo = styled.div`
  font-size: 36px;
  font-weight: 800;
  margin-right: auto;
`;

const Items = styled.div`
  margin-left: auto;
`;
