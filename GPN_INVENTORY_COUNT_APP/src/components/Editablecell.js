import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
// import { fontSize, gridSize } from "@atlaskit/theme/constants";
import { InlineEditableTextfield } from "@atlaskit/inline-edit";

const CellContainer = styled.div`
  display: flex;
  flex: 1 0 100%;
  align-items: center;
  height: 100%;
  overflow: hidden;
  margin: 0 -5px;
  padding: 5px;
  border: 1px dashed transparent;
`;

const EditableCell = (props) => {
  const [value, setValue] = useState(props.cellData);
  const targetRef = useRef(null);

  const handleEdit = (value) => {
    //  add further logic here
    setValue(value);
  };

  return (
    <CellContainer ref={targetRef}>
      <InlineEditableTextfield
        defaultValue={value}
        onConfirm={(value) => handleEdit(value)}
        placeholder="Click to enter text"
      />
    </CellContainer>
  );
};

export default EditableCell;
