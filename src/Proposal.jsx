import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import Target from './Target';
import Input from './Input';
import { useTranslation } from 'react-i18next';

const Proposal = ({
  proposalIndex,
  target,
  inputs,
  processData,
  updateTarget,
  addInput,
  removeInput,
  updateInput,
  inflationRate,
  currencyRate,
  useInflation,
  setProcessData,
  disabled,
  selectedCurrency,
  company,
  notionalAmount,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    setProcessData(proposalIndex, []);
  }, [proposalIndex, setProcessData]);

  return (
    <Card elevation={1} sx={{ position: 'relative', minHeight: 180, mt: proposalIndex > 0 ? 2 : 0 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('Proposal')} {proposalIndex + 1}
        </Typography>
        <Target
          target={target}
          updateTarget={updateTarget}
          disabled={disabled}
          company={company}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <IconButton onClick={addInput} disabled={inputs.length >= 6 || disabled}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={removeInput} disabled={inputs.length <= 1 || disabled}>
            <RemoveIcon />
          </IconButton>
        </Box>
        {inputs.map((input, inputIndex) => (
          <Input
            key={inputIndex}
            input={input}
            updateInput={(newInput) => updateInput(inputIndex, newInput)}
            disabled={disabled}
            isFirst={inputIndex === 0}
            company={company}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default Proposal;