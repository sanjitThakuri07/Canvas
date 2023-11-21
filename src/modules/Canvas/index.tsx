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
    const lines: any = [];

    elements.forEach((element: any, index: number) => {
      if (index !== draggedIndex) {
        const deltaX = Math.abs(newPosition.x - (element.x + element.width / 2));
        const deltaY = Math.abs(newPosition.y - (element.y + element.height / 2));
        const middleY = Math.abs(element.y + element.height / 2);
        const middleX = Math.abs(element.x + element.width / 2);

        const enteringBox: any = elements[draggedIndex];
        const enteringBoxWidth = enteringBox.width;
        const enteringBoxHeight = enteringBox.height;

        // =========== start of identifying top bottom and top middle =========
        const isNearTop =
          newPosition.y + enteringBoxHeight + 5 >= element.y &&
          newPosition.y + enteringBoxHeight <= middleY;

        //   + 5 for some margin between
        const isNearBottom =
          newPosition.y >= middleY && newPosition.y <= element.y + element.height + 5;

        const isMiddleTopBottom =
          newPosition.y + enteringBoxHeight >= element.y &&
          newPosition.y + enteringBoxHeight <= element?.height + element.y;

        //========= end of identifying top bottom and top middle ============

        // =========== start of identifying left right and left-right middle =========

        const isNearLeft =
          newPosition.x + enteringBoxWidth + 5 >= element.x &&
          newPosition.x + enteringBoxWidth <= middleX;

        const isNearRight =
          newPosition.x >= middleX && newPosition.x <= element.x + element.width + 5;

        const isLeftRightMiddle =
          newPosition.x + enteringBoxWidth >= element.x &&
          newPosition.x + enteringBoxWidth <= element?.width + element.y;

        // =========== end of identifying left right and left-right middle =========

        const isEnteringBoxLarger =
          enteringBoxWidth >= 0.7 * element.width && enteringBoxWidth <= 0.8 * element.width;
        const isEnteringBoxJustEntered =
          deltaX < 0.5 * enteringBoxWidth && deltaY < 0.5 * enteringBoxHeight;

        // logic for between
        if (isEnteringBoxJustEntered) {
          // Show lines for just entered box
          lines.push({
            points: [element.x, element.y, element.x + element.width, element.y],
            stroke: "red",
            strokeWidth: 1,
          });

          lines.push({
            points: [element.x, element.y, element.x, element.y + element.height],
            stroke: "red",
            strokeWidth: 1,
          });
        }

        // for top, botttom, is middletopbottom
        if (isNearTop) {
          // Show top and bottom lines
          lines.push({
            points: [0, element.y, canvasWidth, element.y],
            stroke: "red",
            strokeWidth: 1,
          });
        } else if (isNearBottom) {
          lines.push({
            points: [0, element.y + element.height, canvasWidth, element.y + element.height],
            stroke: "red",
            strokeWidth: 1,
          });
        } else if (isMiddleTopBottom) {
          lines.push(
            {
              points: [0, element.y, canvasWidth, element.y],
              stroke: "red",
              strokeWidth: 1,
            },
            {
              points: [0, element.y + element.height, canvasWidth, element.y + element.height],
              stroke: "red",
              strokeWidth: 1,
            },
          );
        }

        if (isNearLeft) {
          // Show left and right lines
          lines.push({
            points: [element.x, 0, element.x, canvasHeight],
            stroke: "red",
            strokeWidth: 1,
          });
        } else if (isNearRight) {
          lines.push({
            points: [element.x + element.width, 0, element.x + element.width, canvasHeight],
            stroke: "red",
            strokeWidth: 1,
          });
        } else if (isLeftRightMiddle) {
          lines.push(
            {
              points: [element.x, 0, element.x, canvasHeight],
              stroke: "red",
              strokeWidth: 1,
            },
            {
              points: [element.x + element.width, 0, element.x + element.width, canvasHeight],
              stroke: "red",
              strokeWidth: 1,
            },
          );
          //   lines.push({
          //     points: [element.x + element.width, 0, element.x + element.width, canvasHeight],
          //     stroke: "red",
          //     strokeWidth: 1,
          //   });
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
