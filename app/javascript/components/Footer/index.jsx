import React from 'react';
import { StyledFooter, FooterText, SocialLink, SocialLinks } from './style'

const Footer = () => {
  return (
    <StyledFooter>
      <FooterText>&copy; 2025 FastOrder - Todos os direitos reservados</FooterText>
      <SocialLinks>
        <SocialLink href="#facebook">Facebook</SocialLink>
        <SocialLink href="#instagram">Instagram</SocialLink>
      </SocialLinks>
    </StyledFooter>
  );
};

export default Footer;
