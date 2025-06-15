import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import Target from './Target';
import Input from './Input';
import ProposalInfo from './ProposalInfo';
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
  company,
  cashValueInfo,
}) => {
  const { t } = useTranslation();
  const [openProposalInfo, setOpenProposalInfo] = useState(false);

  // Check if any input has pdf_base64
  const hasPdfBase64 = inputs.some((input) => input.pdf_base64);

  useEffect(() => {
    // Only update processData if it's not already an empty array
    if (!Array.isArray(processData) || processData.length !== 0) {
      setProcessData(proposalIndex, []);
    }
  }, [proposalIndex, setProcessData, processData]);

  return (
    <Card elevation={1} sx={{ position: 'relative', minHeight: 180, mt: proposalIndex > 0 ? 2 : 0 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('Proposal')} {proposalIndex + 1}
        </Typography>
        <Target target={target} updateTarget={updateTarget} disabled={disabled} company={company} />
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
        {hasPdfBase64 && (
          <Button
            variant="contained"
            onClick={() => setOpenProposalInfo(true)}
            sx={{ mt: 2 }}
          >
            {t('View Proposal Info')}
          </Button>
        )}
      </CardContent>
      <ProposalInfo
        open={openProposalInfo}
        onClose={() => setOpenProposalInfo(false)}
        cashValueInfo={cashValueInfo}
        proposal={{ target, inputs }} // Pass the proposal data
      />
    </Card>
  );
};

export default Proposal;