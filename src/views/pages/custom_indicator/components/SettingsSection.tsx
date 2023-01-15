/* eslint-disable react/require-default-props */
import React, { SyntheticEvent } from 'react';
import TreeView from '@mui/lab/TreeView';
import ForumIcon from '@mui/icons-material/Forum';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import StyledTreeItem from './TreeView';

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type Props = {
    onSettingsClicked: (id: number) => void;
    reportLists: { id: number; name: string }[];
};

export default function SettingsSection({
    onSettingsClicked,
    reportLists
}: Props) {
    return (
        <TreeView
            onNodeSelect={(_event: SyntheticEvent, id: string) => {
                onSettingsClicked(Number(id));
            }}
            aria-label="settings"
            defaultExpanded={['data-entries-settings']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
            {reportLists !== null
                ? reportLists.map((value) => {
                      return (
                          <StyledTreeItem
                              key={value.id}
                              id={value.id.toString()}
                              nodeId={value.id.toString()}
                              labelText={value.name}
                              labelIcon={ForumIcon}
                              color="#a250f5"
                              bgColor="#f3e8fd"
                          />
                      );
                  })
                : ''}
        </TreeView>
    );
}
