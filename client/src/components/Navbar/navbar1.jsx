import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Badge,
    MenuItem,
    Menu,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    Tabs,
    Tab,
    Fade,
} from '@mui/material';

import {
    Menu as MenuIcon,
    Search as SearchIcon,
    AccountCircle,
    MoreVert as MoreIcon,
    ShoppingCart as ShoppingCartIcon,
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';

import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBookOpen, FaThLarge, FaPhoneAlt } from "react-icons/fa";
import { useCart } from '../pages/cartContext';
import { useAuth } from '../pages/AuthProvider'; // Make sure path is correct
import axios from 'axios';

// Enhanced styled components
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '20px',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    transition: theme.transitions.create('all', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.short,
    }),
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function LinkTab(props) {
    const location = useLocation();
    const isActive = location.pathname === props.to;
    
    return (
        <Tab
            component={Link}
            to={props.to}
            sx={{
                fontWeight: '600',
                fontFamily: 'Inter',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                    color: 'white',
                },
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                    width: '60%',
                    height: '2px',
                    backgroundColor: 'white',
                    transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                    transform: 'translateX(-50%) scaleX(1)',
                }
            }}
            {...props}
        />
    );
}

LinkTab.propTypes = {
    to: PropTypes.string.isRequired,
};

function NavTabs({shopOpen, setShopOpen}) {
    const [value, setValue] = React.useState(0);
    const { user } = useAuth();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleShopClick = () => {
        setShopOpen(!shopOpen);
    };

    // Function to determine dashboard URL based on user role
    const getDashboardUrl = () => {
        if (!user) return "/sign"; // If not logged in, go to sign in
        
        switch (user.role?.toLowerCase()) {
            case 'admin':
                return "/adminAnalytics";
            case 'seller':
                return "/analytics"; // Using your existing seller dashboard route
            case 'buyer':
                return "/orderhistory"; // Using your existing buyer dashboard route
            default:
                return "/sign";
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
                role="navigation"
                sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'transparent',
                    }
                }}
            >
                <LinkTab label="Home" to="/" />
                <LinkTab label="Dashboard" to={getDashboardUrl()}/>
                <LinkTab label="Selling" to="/catalog" />
                <LinkTab label="Rental" to="/rentalCatalog" />
            </Tabs>
        </Box>
    );
}

const theme = createTheme({
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
    palette: {
        primary: {
            main: '#ffffff',
            light: '#e0868f',
            dark: 'ce5f6a',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ecdd07',
            light: '#f2e0cb',
            dark: '#f4dbbc',
            contrastText: '#4f220f',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: '#1C2E4A',
                    borderBottom: 'none',
                },
            },
        },

        MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '70px !important', // Ensure consistent height
          backgroundColor: 'inherit', // Inherit from AppBar
        },
      },
    },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    marginTop: '8px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                    color: 'white',
                },
            },
        },
    },
});

export default function PrimarySearchAppBar() {
    const { cartItems } = useCart();
    const { user, logout } = useAuth(); // Include logout function
    const navigate = useNavigate();
    const cart_items = cartItems ? cartItems.length : 0;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [sellingMobileOpen, setSellingMobileOpen] = useState(false);
    const [rentalMobileOpen, setRentalMobileOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    // New state variables for New and Second Hand dropdowns
    const [newSellingOpen, setNewSellingOpen] = useState(false);
    const [secondHandSellingOpen, setSecondHandSellingOpen] = useState(false);
    const [newRentalOpen, setNewRentalOpen] = useState(false);
    const [secondHandRentalOpen, setSecondHandRentalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await axios.get("http://localhost:3000/api/categories/getAllCategories");
            
            if (response.data && (response.data.data || Array.isArray(response.data))) {
              const categoriesData = Array.isArray(response.data) ? response.data : 
                                  (response.data.data ? response.data.data : []);
              setCategories(categoriesData);
            } else {
              setError("Invalid data format received from server");
            }
            
            setLoading(false);
          } catch (err) {
            setError(err.message || "Failed to fetch categories");
            setLoading(false);
          }
        };
    
        fetchCategories();
    }, []);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    // Function to determine dashboard URL based on user role - same as in NavTabs
    const getDashboardUrl = () => {
        if (!user) return "/sign"; // If not logged in, go to sign in
        
        switch (user.role?.toLowerCase()) {
            case 'admin':
                return "/adminAnalytics";
            case 'seller':
                return "/analytics";
            case 'buyer':
                return "/orderhistory";
            default:
                return "/sign";
        }
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleSellingMobileClick = () => {
        setSellingMobileOpen(!sellingMobileOpen);
    };

    const handleRentalMobileClick = () => {
        setRentalMobileOpen(!rentalMobileOpen);
    };

    const handleNewSellingClick = () => {
        setNewSellingOpen(!newSellingOpen);
    };
    
    const handleSecondHandSellingClick = () => {
        setSecondHandSellingOpen(!secondHandSellingOpen);
    };
    
    const handleNewRentalClick = () => {
        setNewRentalOpen(!newRentalOpen);
    };
    
    const handleSecondHandRentalClick = () => {
        setSecondHandRentalOpen(!secondHandRentalOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/sign');
        handleMenuClose();
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
        >
            {!user ? (
                <>
                    <MenuItem 
                onClick={handleMenuClose} 
                component={Link} 
                to="/sign"
                sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(237, 45, 147, 0.1)',
                    }
                }}
            >
                Sign Up
            </MenuItem>
            <MenuItem 
                onClick={handleMenuClose} 
                component={Link} 
                to="/sign"
                sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(237, 45, 147, 0.1)',
                    }
                }}
            >
                Log In
            </MenuItem>
                </>
            ) : (
                <>
                    <MenuItem onClick={handleMenuClose} component={Link} to={getDashboardUrl()}>Dashboard</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
            )}
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
            TransitionComponent={Fade}
        >
            <MenuItem 
                component={Link} 
                to="/cart"
                sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(237, 45, 147, 0.1)',
                    }
                }}
            >
                <IconButton aria-label="cart" color="inherit">
                    <Badge badgeContent={cart_items} color="white">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
                <p>Cart</p>
            </MenuItem>
            <MenuItem 
                onClick={handleProfileMenuOpen}
                sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(237, 45, 147, 0.1)',
                    }
                }}
            >
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const drawer = (
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            sx={{ 
                '& .MuiDrawer-paper': { 
                    width: 280,
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: '600',
                    mb: 2,
                    textAlign: 'center'
                }}>
                    TechWare
                </Typography>
                <List>
                    <ListItemButton 
                        component={Link} 
                        to="/"
                        onClick={handleDrawerToggle}
                        sx={{
                            borderRadius: '8px',
                            mb: 0.5,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton 
                        component={Link} 
                        to= {getDashboardUrl()}
                        onClick={handleDrawerToggle}
                        sx={{
                            borderRadius: '8px',
                            mb: 0.5,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    
                    {/* Selling Section */}
                    <ListItemButton 
                        onClick={handleSellingMobileClick}
                        sx={{
                            borderRadius: '8px',
                            mb: 0.5,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <ListItemText primary="Selling" />
                        {sellingMobileOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={sellingMobileOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {categories && categories.map(category => (
                                <ListItemButton 
                                    key={`selling-${category.slug}`}
                                    component={Link} 
                                    to={`/category/${category.slug}`}
                                    sx={{ 
                                        pl: 4,
                                        borderRadius: '8px',
                                        mb: 0.5,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                    onClick={handleDrawerToggle}
                                >
                                    <ListItemText primary={category.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                    
                    {/* Rental Section */}
                    <ListItemButton 
                        onClick={handleRentalMobileClick}
                        sx={{
                            borderRadius: '8px',
                            mb: 0.5,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <ListItemText primary="Rental" />
                        {rentalMobileOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={rentalMobileOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {categories && categories.map(category => (
                                <ListItemButton 
                                    key={`rental-${category.slug}`}
                                    component={Link} 
                                    to={`/rental-category/${category.slug}`}
                                    sx={{ 
                                        pl: 4,
                                        borderRadius: '8px',
                                        mb: 0.5,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                    onClick={handleDrawerToggle}
                                >
                                    <ListItemText primary={category.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                    {user && (
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                )}
                </List>
            </Box>
        </Drawer>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='fixed' elevation={0}>
                    <Toolbar sx={{ minHeight: '70px' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ 
                                mr: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* <Box sx={{ flexGrow: 1 }}>
                            <NavTabs shopOpen={shopOpen} setShopOpen={setShopOpen} /> */}
                        
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <NavTabs />
                        </Box>
                        
                        <Box sx={{ 
                            flexGrow: 1, 
                            display: 'flex', 
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            ml: { md: '16px' }
                        }}>
                            <Typography
                                variant="h4"
                                noWrap
                                component={Link}
                                to="/"
                                sx={{
                                    fontWeight: '700',
                                    color: 'white',
                                    letterSpacing: '1px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    '&:hover': {
                                        opacity: 0.9,
                                    }
                                }}
                            >
                                TechWare
                            </Typography>
                        </Box>
                        {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Box onMouseLeave={() => setShopOpen(false)}>
                                {shopOpen && (
                                    <Box sx={{ position: 'absolute', top: '64px', bgcolor: 'white', boxShadow: 1, zIndex: 10, display: 'flex' }}>
                                        <List disablePadding>
                                            <ListItem button component={Link} to="/shop/selling">
                                                <ListItemText primary="Selling" />
                                            </ListItem>
                                            <ListItem button component={Link} to="/shop/rental">
                                                <ListItemText primary="Rental" />
                                            </ListItem>
                                        </List>
                                    </Box>
                                )}
                            </Box>
                            <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <IconButton aria-label="cart">
                                    <Badge badgeContent={cart_items} color="secondary"> */}
                        
                        <Box sx={{ 
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Link to="/cart" style={{ textDecoration: 'none' }}>
                                <IconButton 
                                    aria-label="cart"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    <Badge 
                                        badgeContent={cart_items} 
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: 'rgb(24, 161, 148)',
                                                color: 'white',
                                                right: 4,
                                                top: 4,
                                                border: `2px solid ${theme.palette.primary.main}`,
                                                padding: '0 4px',
                                            }
                                        }}
                                    >
                                        <ShoppingCartIcon sx={{ color: 'white' }} />
                                    </Badge>
                                </IconButton>
                            </Link>
                            
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                <AccountCircle />
                            </IconButton>
                        </Box>
                        
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                {renderMenu}
                {drawer}
                {/* Add padding to account for fixed navbar */}
                <Box sx={{ height: '70px' }} />
            </Box>
        </ThemeProvider>
    );
}