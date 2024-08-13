import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

const MoneyInput = ({ value, onChange, ...props }) => {
  return (
    <NumericFormat
      {...props}
      value={value}
      thousandSeparator={true}
      prefix={'R$ '}
      decimalScale={2}
      fixedDecimalScale
      onValueChange={(values) => onChange(values.floatValue)}
      customInput={TextField}
    />
  );
};

const InputFormatMoney = () => {
  const [amount, setAmount] = useState('');

  return (
    <MoneyInput
      label="Valor"
      value={amount}
      onChange={setAmount}
      variant="outlined"
      fullWidth
    />
  );
};

export default InputFormatMoney;
