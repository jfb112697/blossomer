import React, { useState } from "react";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { setPersistence } from "firebase/auth";

function CurrencyInput(props) {
  const [displayValue, setDisplayValue] = useState();

  return (
    <NumericFormat
      value={props.price}
      name="Price"
      numberStr
      customInput={TextField}
      valueIsNumericString={true}
      prefix={"$"}
      displayType="input"
      type="text"
      thousandSeparator={","}
      decimalSeparator={"."}
      decimalScale={2}
      fixedDecimalScale={2}
      variant="outlined"
      label="Item Price"
      onKeyDown={(e) => {
        if (e.key.match(/^[a-zA-Z]{1}$/)) {
          e.preventDefault();
          return;
        }
      }}
      onValueChange={(values) => {
        const { formattedValue, value, floatValue } = values;
        props.setPrice(floatValue);
      }}
    />
  );
}
export default CurrencyInput;
