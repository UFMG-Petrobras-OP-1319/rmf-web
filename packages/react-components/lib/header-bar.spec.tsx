import { IconButton, Tab, Toolbar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { cleanup, render, screen } from '@testing-library/react';
import { NavigationBar } from '../lib/navigation-bar';
import { HeaderBar } from './header-bar';

describe('Header Bar', () => {
  it('renders correctly', () => {
    const mockOnTabChange = vi.fn();
    render(
      <HeaderBar>
        <NavigationBar onTabChange={mockOnTabChange} value={'building'}>
          <Tab
            key={'building-tab'}
            label={'Building'}
            value={'building'}
            aria-label={`building-tab`}
          />
          <Tab key={'robots-tab'} label={'Robots'} value={'robots'} aria-label={`building-tab`} />
        </NavigationBar>
        <Toolbar variant="dense">
          <Typography variant="caption">Powered by Open-RMF</Typography>
          <IconButton id="user-btn" aria-label={'user-btn'} color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </HeaderBar>,
    );
    expect(screen.getByText('Building')).toBeTruthy();
    expect(screen.getByText('Robots')).toBeTruthy();
    expect(screen.getByText('Powered by Open-RMF')).toBeTruthy();
    expect(screen.getByLabelText('user-btn')).toBeTruthy();
    cleanup();
  });
});
