import React, { useState } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";

const Canvas = () => {
  const canvasWidth = 950;
  const canvasHeight = 400;

  const [elements, setElements] = useState([]);
  const [guideLines, setGuideLines] = useState([]);

  const handleAddElement = () => {
    const newElement = {
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      fill: "blue",
    };

    setElements([...elements, newElement]);
  };

  const handleDragMove = (index, newPosition) => {
    const alignedGuideLines = getAlignedGuideLines(index, newPosition);
    setGuideLines(alignedGuideLines);
  };

  const handleDragEnd = (index, newPosition) => {
    const alignedGuideLines = getAlignedGuideLines(index, newPosition);
    setGuideLines([]);

    const updatedElements = [...elements];
    updatedElements[index].x = newPosition.x;
    updatedElements[index].y = newPosition.y;
    setElements(updatedElements);
  };

  const dragBoundFunc = (pos, element) => {
    const x = Math.max(0, Math.min(pos.x, canvasWidth - element.width));
    const y = Math.max(0, Math.min(pos.y, canvasHeight - element.height));
    return { x, y };
  };

  const getAlignedGuideLines = (draggedIndex, newPosition) => {
    const lines = [];

    elements.forEach((element, index) => {
      if (index !== draggedIndex) {
        const deltaX = Math.abs(newPosition.x - (element.x + element.width / 2));
        const deltaY = Math.abs(newPosition.y - (element.y + element.height / 2));

        const enteringBox = elements[draggedIndex];
        const enteringBoxWidth = enteringBox.width;
        const enteringBoxHeight = enteringBox.height;

        const isNearTop = newPosition.y <= element.y + 5 && newPosition.y >= element.y - 5;
        const isNearBottom =
          newPosition.y + enteringBoxHeight >= element.y + element.height - 5 &&
          newPosition.y + enteringBoxHeight <= element.y + element.height + 5;
        const isNearLeft = newPosition.x <= element.x + 5 && newPosition.x >= element.x - 5;
        const isNearRight =
          newPosition.x + enteringBoxWidth >= element.x + element.width - 5 &&
          newPosition.x + enteringBoxWidth <= element.x + element.width + 5;

        const isEnteringBoxLarger = enteringBoxWidth >= 1.7 * element.width; // 70% larger

        if (isNearTop) {
          // Show top line
          lines.push({
            points: [0, element.y, canvasWidth, element.y],
            stroke: "red",
            strokeWidth: 1,
          });
        }

        if (isNearBottom) {
          // Show bottom line
          lines.push({
            points: [0, element.y + element.height, canvasWidth, element.y + element.height],
            stroke: "red",
            strokeWidth: 1,
          });
        }

        if (isNearLeft) {
          // Show left line
          lines.push({
            points: [element.x, 0, element.x, canvasHeight],
            stroke: "red",
            strokeWidth: 1,
          });
        }

        if (isNearRight) {
          // Show right line
          lines.push({
            points: [element.x + element.width, 0, element.x + element.width, canvasHeight],
            stroke: "red",
            strokeWidth: 1,
          });
        }

        if (isEnteringBoxLarger) {
          // Show center lines for larger entering box
          lines.push({
            points: [0, newPosition.y, canvasWidth, newPosition.y],
            stroke: "red",
            strokeWidth: 1,
          });

          lines.push({
            points: [
              0,
              newPosition.y + enteringBoxHeight,
              canvasWidth,
              newPosition.y + enteringBoxHeight,
            ],
            stroke: "red",
            strokeWidth: 1,
          });
        }
      }
    });

    return lines;
  };

  return (
    <div>
      <h2>Canvas</h2>
      <button onClick={handleAddElement}>Add Element</button>
      <Stage width={canvasWidth} height={canvasHeight} style={{ border: "1px solid red" }}>
        <Layer>
          {guideLines.map((line, index) => (
            <Line key={index} {...line} />
          ))}
          {elements.map((element, index) => (
            <Rect
              key={index}
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              fill={element.fill}
              draggable
              dragBoundFunc={(pos) => dragBoundFunc(pos, element)}
              onDragMove={(e) => handleDragMove(index, e.target.position())}
              onDragEnd={(e) => handleDragEnd(index, e.target.position())}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
