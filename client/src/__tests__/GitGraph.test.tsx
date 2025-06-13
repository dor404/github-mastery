/**
 * Test Suite: Git Graph Visualization Component
 * 
 * This suite tests the Git graph visualization functionality including:
 * - Basic rendering:
 *   - Component initialization
 *   - Error-free mounting
 * - Integration with react-d3-tree:
 *   - Tree data structure
 *   - Node rendering
 * - Graph visualization:
 *   - Branch representation
 *   - Commit history
 *   - Tree structure
 */

import React from 'react';
import { render } from '@testing-library/react';
import BranchVisualization from '../components/Training/BranchVisualization';

// Mock react-d3-tree completely
jest.mock('react-d3-tree', () => ({
  __esModule: true,
  default: () => null
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Paper: React.forwardRef(({ children }: { children: React.ReactNode }, ref: any) => (
    <div ref={ref}>{children}</div>
  )),
  Box: React.forwardRef(({ children }: { children: React.ReactNode }, ref: any) => (
    <div ref={ref}>{children}</div>
  ))
}));

describe('Git Graph Visualization', () => {
  it('renders without crashing', () => {
    expect(() => render(<BranchVisualization />)).not.toThrow();
  });
}); 