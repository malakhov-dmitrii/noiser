import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@material-ui/core';
import { Email, Chat } from '@material-ui/icons';
import { version } from '../../../../../package.json';

const Footer = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center" pb={2} flexWrap="wrap">
        <Box>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<Chat />}
            href="https://join.slack.com/t/slack-aqi7445/shared_invite/zt-tjtkkq7k-WXtaYSouOvZT2C11dx3cAg"
            target="_blank"
            rel="noopener"
          >
            Join the community!
          </Button>
        </Box>

        <Box px={3}>
          <a
            rel="noopener noreferrer"
            href="https://www.producthunt.com/posts/noizer?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-noizer"
            target="_blank"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=290204&theme=light"
              alt="Noizer - Ambient sounds. Like Noisli, but free | Product Hunt"
              style={{ width: '250px', height: '54px' }}
              width="250"
              height="54"
            />
          </a>
        </Box>

        <Button color="secondary" variant="outlined" href="mailto:mitia2022@gmail.com" target="_blank" rel="noopener" startIcon={<Email />}>
          Email the author
        </Button>
      </Box>
      <Box display="flex">
        <Box mx={2}>
          <Typography variant="caption">Version {version}</Typography>
        </Box>

        <Box mr={2}>
          <Link to="/privacy">Privacy policy</Link>
        </Box>
        <Box>
          <Link to="/terms">Terms of service</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
