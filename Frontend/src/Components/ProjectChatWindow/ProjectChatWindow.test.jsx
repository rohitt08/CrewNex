import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectChatWindow from './ProjectChatWindow';

// Mock socket.io-client to avoid real network connections during tests
vi.mock('socket.io-client', () => {
  return {
    io: vi.fn(() => ({
      emit: vi.fn(),
      on: vi.fn(),
      disconnect: vi.fn(),
    })),
  };
});

// Mock the framer-motion library so animations run instantly
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      button: ({ children, whileHover, whileTap, initial, animate, exit, ...props }) => (
        <button {...props}>{children}</button>
      ),
      div: ({ children, transition, initial, animate, exit, ...props }) => (
        <div {...props}>{children}</div>
      ),
    },
  };
});

// Mock axios to avoid real API calls for chat history
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(() => Promise.resolve({ data: { success: true, messages: [] } })),
    },
  };
});

describe('ProjectChatWindow', () => {
  it('renders the floating chat button initially', () => {
    render(<ProjectChatWindow projectId="123" currentUserId="456" />);
    // The button has a MessageSquare icon and no text, so we can find it by checking for the button element
    // Let's use role
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('opens the chat window when the button is clicked', async () => {
    render(<ProjectChatWindow projectId="123" currentUserId="456" />);
    const button = screen.getByRole('button');
    
    // Click to open
    fireEvent.click(button);
    
    // Once open, we should see "Team Chat" text
    expect(screen.getByText('Team Chat')).toBeInTheDocument();
    
    // The input field should also be visible
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  it('allows typing a message and clears input upon sending', async () => {
    render(<ProjectChatWindow projectId="123" currentUserId="456" />);
    
    // Open chat and wait for effects
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    
    const input = await screen.findByPlaceholderText('Type a message...');
    const sendButton = screen.getAllByRole('button').find(b => b.type === 'submit');

    // Type a message
    fireEvent.change(input, { target: { value: 'Hello team!' } });
    expect(input.value).toBe('Hello team!');

    await new Promise(r => setTimeout(r, 0));

    // Submit form
    await act(async () => {
      fireEvent.submit(input.closest('form'));
    });

    // Input should be cleared
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
