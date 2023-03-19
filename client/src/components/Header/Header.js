import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';


import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';    
import { logoutUser } from '../../actions/auth';


const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

  const location = useLocation();

  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')))
  },[location])

  const logout = async(e) => {
    await logoutUser();
    dispatch({ type: 'LOGOUT'})
    navigate("/login");
    setUser(null)
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  }

  //hovering effect
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  

  if(!user) return (
    <div className='flex justify-between px-6 mt-1 pb-1 border-b-2'>
      <img style={{width: '50px', cursor: 'pointer'}} onClick={()=> navigate('/')} src="https://i.postimg.cc/hGZKzdkS/logo.png" alt="arc-invoice" />
      {/* <button className="btn btn-outline btn-primary">Button</button> */}
      <button className='btn btn-outline btn-primary btn-sm text-lg font-normal mr-1 mt-2 rounded-2xl normal-case'>
        <Link to="/login">Get Started</Link>
      </button>
    </div>
  )

  return (
    <div className='flex justify-end px-6 pt-3 border-b-2 border-gray-400 bg-gray-200'>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 40, height: 40, }} 
            style={{ marginTop:"-9px", fontWeight:"bold",  backgroundColor: ' rgb(0, 119, 255)'}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >{user?.result?.name?.charAt(0)}</Avatar>
          </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 10,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          navigate("/contact-us");
          handleClose();
        }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {user?.result?.name}
        </MenuItem>
        <MenuItem onClick={() =>{
                        logout();
                        handleClose();
                    }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Header

