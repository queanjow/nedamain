/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import EditIcon from '@mui/icons-material/Edit';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)'
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit'
        }
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2)
        }
    }
}));

type StyledTreeItemProps = TreeItemProps & {
    id: string;
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
    showEditButton?: boolean;
    onEditButtonClicked?: (id: string) => void | null;
} & typeof DefaultProps;

const DefaultProps = {
    showEditButton: false,
    onEditButtonClicked: null,
    bgColor: '',
    color: '',
    labelInfo: ''
};

export default function StyledTreeItem({
    id,
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    showEditButton,
    onEditButtonClicked,
    ...other
}: StyledTreeItemProps) {
    return (
        <StyledTreeItemRoot
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0
                    }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    {onEditButtonClicked !== null && showEditButton ? (
                        <IconButton
                            size="small"
                            aria-label="edit"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditButtonClicked(id);
                            }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    ) : (
                        ''
                    )}
                </Box>
            }
            style={{
                color : '--tree-view-color',
                
            }}
            {...other}
        />
    );
}

StyledTreeItem.defaultProps = DefaultProps;
