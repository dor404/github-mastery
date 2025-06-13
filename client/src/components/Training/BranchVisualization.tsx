import React, { useState, useCallback } from 'react';
import { Tree, CustomNodeElementProps } from 'react-d3-tree';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';

interface BranchNode {
  name: string;
  attributes?: {
    commit?: string;
    message?: string;
    timestamp?: string;
    type?: 'branch' | 'merge';
  };
  children?: BranchNode[];
}

interface BranchVisualizationProps {
  initialData?: BranchNode;
  interactive?: boolean;
}

const BranchVisualization: React.FC<BranchVisualizationProps> = ({
  initialData,
  interactive = false,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.6);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: 200,
      });
      // Adjusted initial position
      setTranslate({
        x: 100, // Increased from 50 to 100 for better initial view
        y: containerRef.current.offsetHeight / 2,
      });
    }
  }, []);

  const getBranchColor = (branchName: string) => {
    if (branchName.includes('main')) {
      return '#2c3e50'; // Dark blue for main
    }
    if (branchName.includes('feat')) {
      return '#3498db'; // Light blue for feature
    }
    return '#2ecc71'; // Green for others
  };

  const getActionColor = (type?: string) => {
    switch (type) {
      case 'branch':
        return '#4CAF50'; // Green for branch
      case 'merge':
        return '#FF9800'; // Orange for merge
      default:
        return '#666';
    }
  };

  const renderForeignObjectNode = (props: CustomNodeElementProps) => {
    const { nodeDatum } = props;
    const actionType = nodeDatum.attributes?.type?.toString() || 'branch';
    const actionColor = getActionColor(actionType);

    return (
      <g data-testid={`rendered-node-${nodeDatum.name}`}>
        <circle r={15} fill={actionColor} />
        <foreignObject x={-20} y={-20} width={100} height={100}>
          <Box
            data-testid={`action-label-${actionType}`}
            sx={{
              border: 1,
              borderColor: actionColor,
              backgroundColor: actionColor,
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              marginTop: '25px',
            }}
          >
            {actionType}
          </Box>
        </foreignObject>
      </g>
    );
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
  const handleResetView = () => {
    setZoom(0.6);
    if (containerRef.current) {
      setTranslate({
        x: 100,
        y: containerRef.current.offsetHeight / 2,
      });
    }
  };

  // Add a hidden div with tree data for testing
  const treeData = initialData || {
    name: 'main',
    children: [
      {
        name: 'feat',
        attributes: { type: 'branch' },
        children: [
          {
            name: 'feat',
            attributes: { type: 'merge' },
          },
        ],
      },
    ],
  };

  return (
    <Paper
      ref={containerRef}
      sx={{
        width: '100%',
        height: 200,
        overflow: 'hidden',
        position: 'relative',
        mb: 2,
        backgroundColor: '#1a1a1a', // Dark background like in the image
      }}
    >
      <div data-testid="tree-data-hidden" style={{ display: 'none' }}>
        {JSON.stringify(treeData)}
      </div>
      {dimensions.width > 0 && (
        <>
          <Tree
            data={treeData}
            orientation="horizontal"
            pathFunc="step"
            dimensions={dimensions}
            translate={translate}
            zoom={zoom}
            renderCustomNodeElement={renderForeignObjectNode}
            separation={{ siblings: 2, nonSiblings: 2 }}
          />
          {interactive && (
            <Box
              data-testid="zoom-controls"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 1,
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <IconButton
                data-testid="zoom-in-button"
                size="small"
                onClick={handleZoomIn}
                sx={{ color: '#fff' }}
                aria-label="Zoom In"
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                data-testid="zoom-out-button"
                size="small"
                onClick={handleZoomOut}
                sx={{ color: '#fff' }}
                aria-label="Zoom Out"
              >
                <ZoomOutIcon />
              </IconButton>
              <IconButton
                data-testid="reset-view-button"
                size="small"
                onClick={handleResetView}
                sx={{ color: '#fff' }}
                aria-label="Reset View"
              >
                <ResetIcon />
              </IconButton>
            </Box>
          )}
        </>
      )}
      <style>
        {`
          .branch-path {
            stroke: #fff;
            stroke-width: 2;
          }
        `}
      </style>
    </Paper>
  );
};

export default BranchVisualization; 