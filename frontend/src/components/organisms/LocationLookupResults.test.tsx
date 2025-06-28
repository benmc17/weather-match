import { act, render, screen, waitFor } from '@testing-library/react'
import LocationLookupResults from './LocationLookupResults'
import { Option } from '../atoms/DropDownBox'
import '@testing-library/jest-dom'
import { getActivityRanking } from '../../helpers/activity-ranking-helper'

jest.mock('../../helpers/activity-ranking-helper', () => ({
    getActivityRanking: jest.fn(),
}))

jest.mock('../atoms/Paragraph', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('../molecules/ResultsList', () => ({
  __esModule: true,
  default: ({ results }: { results: any }) => <div data-testid="results-list">{JSON.stringify(results)}</div>,
}))

const option: Option = {
  id: 1,
  display: 'London (UK)',
  value: 'London',
  meta: { lat: 51.5, long: -0.12 }
};

describe('LocationLookupResults', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initially show the loading text', async () => {
    render(<LocationLookupResults selectedLocation={option} />)
    expect(screen.getByText('Thinking....')).toBeInTheDocument()
  })

  it('should render results after loading', async () => {
    await act(async () => {
        (getActivityRanking as jest.Mock).mockResolvedValueOnce({
            location: {
                weatherConditions: ['SUNNY', 'WINDY']
            },
            activities: [
                { name: 'Outdoor Sightseeing', rank: 1, suitabilityScore: 9 },
                { name: 'Indoor Sightseeing', rank: 2, suitabilityScore: 8 }
            ]
        })
        render(<LocationLookupResults selectedLocation={option} />)
    });
    await waitFor(() => {
      expect(screen.getByText(/You have selected London/i)).toBeInTheDocument()
      expect(screen.getByTestId('results-list')).toBeInTheDocument()
      expect(screen.getByText(/Outdoor Sightseeing/)).toBeInTheDocument()
      expect(screen.getByText(/Indoor Sightseeing/)).toBeInTheDocument()
    })
  })
})