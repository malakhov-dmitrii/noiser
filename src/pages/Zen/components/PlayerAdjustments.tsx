import React from 'react';
import { Box, ButtonGroup, Button, Typography } from '@material-ui/core';
import { PlaylistsData } from '../Mubert.model';
import { Skeleton } from '@material-ui/lab';

const PlayerAdjustments = ({
  data,
  bitrate,
  intensity,
  onIntensityChange,
  onBitrateChange,
}: {
  data: PlaylistsData | null;
  intensity: string | null;
  bitrate: number | null;
  onBitrateChange: (v: number | null) => void;
  onIntensityChange: (v: string | null) => void;
}) => {
  if (!data)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" mt={0.5}>
        <Box>
          <Skeleton height={60} width={172} />
        </Box>

        <Box ml={2}>
          <Skeleton height={60} width={122} />
        </Box>
      </Box>
    );

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
      <Box>
        <ButtonGroup variant="outlined" color="primary" size="small" aria-label="contained primary button group">
          {data?.available_intensities.map(i => (
            <Button
              variant={intensity === i.intensity ? 'contained' : 'outlined'}
              onClick={() => onIntensityChange(intensity === i.intensity ? null : i.intensity)}
              key={i.intensity}
            >
              {i.intensity}
            </Button>
          ))}
        </ButtonGroup>
        <Typography variant="body2" align="center">
          Intensity
        </Typography>
      </Box>
      <Box ml={2}>
        <ButtonGroup variant="outlined" color="primary" size="small" aria-label="contained primary button group">
          {data?.available_bitrates.map(i => (
            <Button
              key={i.bitrate}
              variant={bitrate === i.bitrate ? 'contained' : 'outlined'}
              onClick={() => onBitrateChange(bitrate === i.bitrate ? null : i.bitrate)}
            >
              {i.bitrate}
            </Button>
          ))}
        </ButtonGroup>
        <Typography variant="body2" align="center">
          Bitrate
        </Typography>
      </Box>
    </Box>
  );
};

export default PlayerAdjustments;
