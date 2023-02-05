import React, { Component } from "react";
import { Paper } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// fake data generator
const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  transition: "all .33s",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({});

function PictureList(props) {
  const onDragEnd = (result) => {
    // dropped outside the list
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return;
    }

    const items = reorder(
      props.items,
      result.source.index,
      result.destination.index
    );

    props.setItems(items);
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <Paper className=" flex-grow-0">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              className="flex flex-col items-center gap-4 py-4"
            >
              {props.items.map((item, index) => (
                <Draggable
                  key={item.name}
                  draggableId={item.name}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      f
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      className="flex flex-col gap-4 transition-all items-center w-11/12 border-slate-800 border-solid rounded-md"
                    >
                      <img
                        onDoubleClick={() => {
                          const newFiles = [...props.items];
                          newFiles.splice(newFiles.indexOf(item), 1);
                          props.setItems(newFiles);
                          if (props.items.length == 1) {
                            props.setItems([]);
                          }
                        }}
                        src={item.preview}
                        width="95%"
                        alt="Product"
                      ></img>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
}
export default PictureList;
