import { Outlet, NavLink } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemText, Box } from '@mui/material';

const pages = [
    { name: 'Syllabus Storage', path: 'syllabus-storage' },
    { name: 'Professor Management', path: 'professor-management' },
    { name: 'Course Management', path: 'course-management' },
    { name: 'Email Center', path: 'email-center' }
];

function AppLayout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box'
                    }
                }}
            >
                <List>
                    {pages.map((page) => (
                        <ListItemButton
                            key={page.path}
                            component={NavLink}
                            to={`/app/${page.path}`}
                        >
                            <ListItemText primary={page.name} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
}

export default AppLayout;