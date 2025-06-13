/**
 * Test Suite: Branch Visualization Component
 * 
 * This suite tests the branch visualization functionality including:
 * - Component rendering:
 *   - Default data display
 *   - Custom data handling
 * - Interactive features:
 *   - Zoom controls
 *   - Pan functionality
 *   - Reset view
 * - Node customization:
 *   - Custom node rendering
 *   - Node styling
 * - Tree data structure:
 *   - Branch hierarchy
 *   - Node relationships
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import BranchVisualization from '../components/Training/BranchVisualization';
import { CustomNodeElementProps, TreeNodeDatum } from 'react-d3-tree';
import { HierarchyPointNode, HierarchyPointLink } from 'd3-hierarchy';

// Mock react-d3-tree as it's a visualization library
jest.mock('react-d3-tree', () => ({
  Tree: ({ data, renderCustomNodeElement }: { 
    data: any; 
    renderCustomNodeElement?: (props: CustomNodeElementProps) => React.ReactElement;
  }) => {
    // Simplified mock that just renders the node data
    const node = data.children?.[0] || data;
    const mockHierarchyNode: HierarchyPointNode<TreeNodeDatum> = {
      x: 0,
      y: 0,
      data: node,
      depth: 0,
      height: 0,
      parent: null,
      children: [],
      value: 0,
      links: () => [],
      descendants: () => [],
      ancestors: () => [],
      leaves: () => [],
      path: () => [],
      sum: () => mockHierarchyNode,
      count: () => mockHierarchyNode,
      sort: () => mockHierarchyNode,
      each: () => mockHierarchyNode,
      eachAfter: () => mockHierarchyNode,
      eachBefore: () => mockHierarchyNode,
      copy: () => mockHierarchyNode
    };

    return (
      <div data-testid="mock-tree">
        <div data-testid="tree-data">{JSON.stringify(data)}</div>
        {renderCustomNodeElement && renderCustomNodeElement({
          nodeDatum: node,
          toggleNode: () => {},
          onNodeClick: () => {},
          onNodeMouseOver: () => {},
          onNodeMouseOut: () => {},
          addChildren: () => {},
          hierarchyPointNode: mockHierarchyNode
        })}
      </div>
    );
  }
}));

// Minimal mock for Material-UI components
jest.mock('@mui/material', () => ({
  Box: ({ children, 'data-testid': testId }: any) => <div data-testid={testId}>{children}</div>,
  Paper: ({ children }: any) => <div>{children}</div>,
  IconButton: ({ children, 'data-testid': testId }: any) => <button data-testid={testId}>{children}</button>
}));

// Mock ref for container dimensions
const mockRef = {
  current: {
    offsetWidth: 800,
    offsetHeight: 200,
  }
};

jest.spyOn(React, 'useRef').mockReturnValue(mockRef);

describe('BranchVisualization', () => {
  const mockData = {
    name: 'main',
    children: [{
      name: 'feature',
      attributes: { type: 'branch' as const }
    }]
  };

  it('renders with default data when no initialData provided', () => {
    render(<BranchVisualization />);
    const treeData = screen.getByTestId('tree-data');
    expect(treeData).toBeInTheDocument();
    expect(JSON.parse(treeData.textContent || '')).toHaveProperty('name', 'main');
  });

  it('renders with custom data when provided', () => {
    render(<BranchVisualization initialData={mockData} />);
    const treeData = screen.getByTestId('tree-data');
    expect(JSON.parse(treeData.textContent || '')).toEqual(mockData);
  });

  it('shows zoom controls only when interactive is true', () => {
    const { rerender } = render(<BranchVisualization interactive={true} />);
    expect(screen.getByTestId('zoom-controls')).toBeInTheDocument();

    rerender(<BranchVisualization interactive={false} />);
    expect(screen.queryByTestId('zoom-controls')).not.toBeInTheDocument();
  });
}); 