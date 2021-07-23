import React from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Shuffle, Backspace } from '@material-ui/icons';
import { PlaylistsData, Category, Group } from '../Mubert.model';
import { SelectionValues } from '../Zen';
import { Skeleton } from '@material-ui/lab';

const SelectionView = ({
  data,
  selectionValues,
  onChange,
  selectedCategory,
  selectedGroup,
  handleClear,
  handleRandom,
}: {
  data: PlaylistsData | null;
  selectionValues: SelectionValues;
  onChange: (type: keyof SelectionValues, value: number | '') => void;
  selectedCategory?: Category;
  selectedGroup?: Group;
  handleClear: () => void;
  handleRandom: () => void;
}) => {
  if (!data)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" mt={0.5}>
        <Box>
          <Skeleton height={40} width={80} />
        </Box>
        <Box ml={2}>
          <Skeleton height={50} width={110} />
        </Box>
        <Box ml={2}>
          <Skeleton height={50} width={110} />
        </Box>
        <Box ml={2}>
          <Skeleton height={50} width={110} />
        </Box>
        <Box ml={2}>
          <Skeleton height={40} width={80} />
        </Box>
      </Box>
    );

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Box mr={1}>
        <Button variant="outlined" size="small" startIcon={<Shuffle color="action" />} color="default" onClick={() => handleRandom()}>
          Random
        </Button>
      </Box>
      <Box width={150}>
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select value={selectionValues.category} onChange={e => onChange('category', +(e.target.value as string))}>
            {data?.categories.map(category => (
              <MenuItem value={category.category_id} key={category.category_id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box width={150} mx={1}>
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel>Group</InputLabel>
          <Select
            value={selectionValues.group}
            disabled={selectionValues.category === null}
            onChange={e => onChange('group', +(e.target.value as string))}
            fullWidth
          >
            {selectedCategory?.groups.map(i => (
              <MenuItem value={i.group_id} key={i.group_id}>
                {i.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box width={150}>
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel>Channel</InputLabel>

          <Select
            defaultValue={null}
            variant="outlined"
            disabled={selectionValues.group === null}
            value={selectionValues.channel}
            onChange={e => onChange('channel', +(e.target.value as string))}
            fullWidth
          >
            {selectedGroup?.channels.map(i => (
              <MenuItem value={i.channel_id} key={i.channel_id}>
                {i.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box ml={1}>
        <Button variant="outlined" size="small" startIcon={<Backspace color="action" />} color="default" onClick={() => handleClear()}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default SelectionView;
