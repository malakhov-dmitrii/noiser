import React from 'react';
import { Box } from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { TreeView } from '@material-ui/lab';
import { PlaylistsData } from '../Mubert.model';

interface RenderTree {
  id: string;
  name: string;
  children?: RenderTree[];
}

const StreamTreeView = ({ data }: { data: PlaylistsData | null }) => {
  const treeData: RenderTree = {
    name: 'Soundscapes',
    id: 'root',
    children: data?.categories.map(c => ({
      id: `category: ${c.category_id}`,
      name: c.name,
      children: c.groups.map(r => ({
        id: `category: ${c.category_id} group: ${r.group_id}`,
        name: r.name,
        children: r.channels.map(c => ({
          id: `group: ${r.group_id} channel: ${c.channel_id}`,
          name: c.name,
          // children: [],
        })),
      })),
    })),
  };

  const renderTree = (nodes: RenderTree) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {nodes.children?.map(node => renderTree(node)) || null}
    </TreeItem>
  );
  return (
    <Box>
      <TreeView
        // className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(treeData)}
      </TreeView>
    </Box>
  );
};

export default StreamTreeView;
