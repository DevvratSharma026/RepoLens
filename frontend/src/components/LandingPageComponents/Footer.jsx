import React from 'react'

import FooterSectionOne from './FooterSectionOne';
import FooterSectionTwo from './FooterSectionTwo';

const Footer = () => {
  return (
    <footer className='relative w-full h-screen py-24 mt-10 overflow-hidden bg-[#05010d] text-white'>
      <FooterSectionOne />
      <FooterSectionTwo />
    </footer>
  );
};


export default Footer