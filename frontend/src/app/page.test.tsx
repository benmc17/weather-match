import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './page';
import { Option } from "../components/atoms/DropDownBox";

jest.mock('../components/organisms/LocationLookup', () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (selectedLocation: Option) => void }) => (
    <div 
        data-testid="location-lookup" 
        onClick={() => onSelect({ id: 12345, display: 'Test', value: 'TEST', meta: { test: 'string' } })}
    >LocationLookup</div>
  ),
}));

jest.mock('../components/organisms/LocationLookupResults', () => ({
  __esModule: true,
  default: ({ selectedLocation }: { selectedLocation: any }) => (
    <div data-testid="location-lookup-results">LocationLookupResults</div>
  ),
}));

jest.mock('../components/templates/MainTemplate', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components/atoms/PageHeader', () => ({
  __esModule: true,
  default: ({ headerText }: { headerText: string }) => <h1>{headerText}</h1>,
}));

describe('Page', () => {
  it('d render the header and LocationLookup by default', () => {
    render(<Page />);
    expect(screen.getByText('Welcome to the Weather Matcher app!')).toBeInTheDocument();
    expect(screen.getByTestId('location-lookup')).toBeInTheDocument();
  });

  it('should render LocationLookupResults when a location is selected', () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId('location-lookup'));
    expect(screen.getByTestId('location-lookup-results')).toBeInTheDocument();
  });
});