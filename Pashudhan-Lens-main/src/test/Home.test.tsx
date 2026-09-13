import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '@/contexts/AppContext'
import Home from '@/pages/Home'

// Test utility wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          {children}
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <Home 
          onGetStarted={() => {}}
          onNavigateAbout={() => {}}
          onNavigateLibrary={() => {}}
        />
      </TestWrapper>
    )
    
    expect(screen.getByText(/critter cognito/i)).toBeDefined()
  })

  it('calls onGetStarted when Get Started button is clicked', async () => {
    const mockGetStarted = vi.fn()
    
    render(
      <TestWrapper>
        <Home 
          onGetStarted={mockGetStarted}
          onNavigateAbout={() => {}}
          onNavigateLibrary={() => {}}
        />
      </TestWrapper>
    )
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    fireEvent.click(getStartedButton)
    
    await waitFor(() => {
      expect(mockGetStarted).toHaveBeenCalledOnce()
    })
  })
})
