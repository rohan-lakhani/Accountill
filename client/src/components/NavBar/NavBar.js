import { Link, useLocation, useNavigate } from 'react-router-dom';

import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddIcon from '@mui/icons-material/Add';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';

import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';


const useStyles = makeStyles(() => ({
  MuiListItemButton:{
    backgroundColor:"red"
  }
}));

const NavBar = () => {

  const location = useLocation();
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('profile')))

  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')))
  },[location])


  const classes = useStyles();

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
      });
    
      const toggleDrawer = (anchor, open) => (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
      };

      const anchor = "left";

  if(!user) return null;

  return (
    <div className='absolute text-white min-h-screen h-full w-16' style={{backgroundColor:"rgb(95, 93, 93)"}} onMouseEnter={toggleDrawer(anchor, true)}>
        <React.Fragment>
          <ul className='w-12 text-center mx-auto'>
        
            <li className='mt-3 mb-6'><ArrowForwardIcon style={{fontSize:"30px"}}/></li>
            <li className='my-6'><DashboardCustomizeIcon style={{fontSize:"30px"}}/></li>
            {/* <li className='my-6'><AddIcon style={{fontSize:"30px"}}/></li> */}
            <li className='my-6'><DescriptionIcon style={{fontSize:"30px"}}/></li>
            <li className='my-6'><PeopleAltIcon style={{fontSize:"30px"}}/></li>
            <li className='my-6'><SettingsIcon style={{fontSize:"30px"}}/></li>

          </ul>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, backgroundColor:"rgb(95, 93, 93)", height:"100vh", color:"white" }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            onMouseLeave={toggleDrawer(anchor, false)}
            >
            <List>

                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <ArrowBackIcon className='text-white'/>
                    </ListItemIcon>
                    <ListItemText primary="Close" />
                    </ListItemButton>
                </ListItem>

                <Link to="/dashboard">
                  <ListItem disablePadding>
                      <ListItemButton>
                      <ListItemIcon>
                          <DashboardCustomizeIcon className='text-white'/>
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                      </ListItemButton>
                  </ListItem>
                </Link>

                {/* <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <AddIcon className='text-white'/>
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                    </ListItemButton>
                </ListItem> */}

                  <Link to="/invoices">
                    <ListItem disablePadding>
                          <ListItemButton>
                          <ListItemIcon>
                              <DescriptionIcon className='text-white'/>
                          </ListItemIcon>
                          <ListItemText primary="Invoices" />
                          </ListItemButton>
                    </ListItem>
                  </Link>

                  <Link to="/customers">
                    <ListItem disablePadding>
                          <ListItemButton>
                          <ListItemIcon>
                              <PeopleAltIcon className='text-white'/>
                          </ListItemIcon>
                          <ListItemText primary="Customers" />
                          </ListItemButton>
                    </ListItem>
                  </Link>

                  <Link to="/settings">
                    <ListItem disablePadding>
                      <ListItemButton>
                      <ListItemIcon>
                          <SettingsIcon className='text-white'/>
                      </ListItemIcon>
                      <ListItemText primary="Settings" />
                      </ListItemButton>
                    </ListItem>
                  </Link>

            </List>
            </Box>
          </SwipeableDrawer>
        </React.Fragment>
      {/* ))} */}
    </div>
  );
}

export default NavBar
