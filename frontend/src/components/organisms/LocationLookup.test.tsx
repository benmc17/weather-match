/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationLookup from './LocationLookup';
import { OpenMeteoLocation } from '../../helpers/open-meteo-location';
import '@testing-library/jest-dom'
import { searchForLocation } from '../../helpers/open-meteo-helper';

jest.mock('../molecules/DropDownSelector', () => ({
    __esModule: true,
    default: ({ onChange, options, onSelect, placeholder }: any) => (
        <div>
            <input
                data-testid="location-input"
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <ul data-testid="options-list">
                {options.map((option: any) => (
                <li key={option.id} onClick={() => onSelect(option)}>
                    {option.display}
                </li>
                ))}
            </ul>
        </div>
    ),
}));

jest.mock('../../helpers/open-meteo-helper', () => ({
    searchForLocation: jest.fn(),
}));

const locations: OpenMeteoLocation[] = [
    {
        id: 1,
        name: "London",
        latitude: 51.5074,
        longitude: -0.1278,
        elevation: 25,
        feature_code: "PPLC",
        country_code: "GB",
        timezone: "Europe/London",
        country_id: 2635167,
        country: "United Kingdom",
        admin1: "England",
        admin1_id: 6269131,
        admin2: "Greater London",
        admin2_id: 2648110,
        population: 8961989,
    },
    {
        id: 2,
        name: "Paris",
        latitude: 48.8566,
        longitude: 2.3522,
        elevation: 35,
        feature_code: "PPLC",
        country_code: "FR",
        timezone: "Europe/Paris",
        country_id: 3017382,
        country: "France",
        admin1: "Île-de-France",
        admin1_id: 11071624,
        admin2: "Paris",
        admin2_id: 2968815,
        population: 2148327,
    }
];

describe('LocationLookup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render input with placeholder', () => {
        render(<LocationLookup onSelect={jest.fn()} />);
        expect(screen.getByPlaceholderText('Enter the location you would like to visit...')).toBeInTheDocument();
    });

    it('should not call searchForLocation for input shorter than 3 chars', async () => {
        render(<LocationLookup onSelect={jest.fn()} />);
        fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'Lo' } });
        expect(searchForLocation).not.toHaveBeenCalled();
    });

    it('should call searchForLocation for input of 3+ chars and displays options', async () => {
        (searchForLocation as jest.Mock).mockResolvedValueOnce(locations);

        render(<LocationLookup onSelect={jest.fn()} />);
        fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'Lon' } });

        await waitFor(() => {
            expect(searchForLocation).toHaveBeenCalledWith('Lon');
            expect(screen.getByText('London (United Kingdom)')).toBeInTheDocument();
            expect(screen.getByText('Paris (France)')).toBeInTheDocument();
        });
    });

    it('should call onSelect when an option is clicked', async () => {
        (searchForLocation as jest.Mock).mockResolvedValueOnce(locations);
        const onSelect = jest.fn();

        render(<LocationLookup onSelect={onSelect} />);
        fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'Lon' } });

        await waitFor(() => {
            fireEvent.click(screen.getByText('London (United Kingdom)'));
            expect(onSelect).toHaveBeenCalledWith(
                expect.objectContaining({ value: 'London' })
            );
        });
    });
});