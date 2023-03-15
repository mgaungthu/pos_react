import React from 'react'
import PropTypes from 'prop-types'
import { alpha, IconButton, InputAdornment, OutlinedInput, styled, Toolbar, Tooltip, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';


const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
  }));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));


const PurchaseToolbar = ({filterName, onFilterName  }) => {
  return (
    <StyledRoot>
      
        <StyledSearch
        value={filterName}
        onChange={onFilterName}
        placeholder="Search Purchase ID..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />
      
    </StyledRoot>
  )
}

PurchaseToolbar.propTypes = {
    filterName: PropTypes.string,
  onFilterName: PropTypes.func
}

export default PurchaseToolbar