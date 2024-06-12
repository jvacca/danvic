import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import NewMyCollections from './new-my-collections';

describe('NewMyCollections', () => {
  test('renders without error', async () => {
    render(<NewMyCollections />);
    await waitFor(() => {
      expect(screen.getByText('Your component JSX goes here')).toBeInTheDocument();
    });
  });

  test('fetches data and sets state', async () => {
    const mockData = {
      coolcatsitems: ['item1', 'item2', 'item3'],
    };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    render(<NewMyCollections />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/users/getuser');
      expect(screen.getByText('Your component JSX goes here')).toBeInTheDocument();
      expect(screen.getByText('item1')).toBeInTheDocument();
      expect(screen.getByText('item2')).toBeInTheDocument();
      expect(screen.getByText('item3')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('handles fetch error', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Fetch error'));

    render(<NewMyCollections />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/users/getuser');
      expect(screen.getByText('Error: Fetch error')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });
});