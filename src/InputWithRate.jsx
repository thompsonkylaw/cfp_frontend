import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';

const InputWithRate = ({ proposal, notionalAmount, updateInput, disabled }) => {
  const { t } = useTranslation();
  const [rates, setRates] = useState(proposal.inputs.map(() => 1)); // Default to 1% for each input

  // Calculate maximum rates and available rates for each input
  const maxRates = proposal.inputs.map((input) =>
    notionalAmount > 0 ? (input.maxAmountWithdrawYearly / notionalAmount) * 100 : 0
  );
  const availableRatesArray = maxRates.map((maxRate) =>
    maxRate >= 1 ? Array.from({ length: Math.floor(maxRate) }, (_, i) => i + 1) : []
  );

  // Adjust rates to maximum available rates if current rates are invalid
  useEffect(() => {
    setRates((prevRates) =>
      prevRates.map((rate, index) => {
        const availableRates = availableRatesArray[index];
        if (availableRates.length > 0) {
          if (!availableRates.includes(rate)) {
            return availableRates[availableRates.length - 1]; // Set to maximum available rate
          }
          return rate;
        }
        return 0;
      })
    );
  }, [availableRatesArray]);

  // Compute amounts based on selected rates and update inputs
  useEffect(() => {
    proposal.inputs.forEach((input, index) => {
      const computedAmount = notionalAmount > 0 ? (rates[index] / 100) * notionalAmount : 0;
      updateInput(index, { ...input, amountWithdrawYearly: computedAmount });
    });
  }, [rates, notionalAmount, updateInput, proposal.inputs]);

  // Handle rate change for a specific input
  const handleRateChange = (index, value) => {
    setRates((prevRates) => {
      const newRates = [...prevRates];
      newRates[index] = value;
      return newRates;
    });
  };

  // Format number with commas
  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <Box sx={{ mt: 2 }}>
      {proposal.inputs.map((input, index) => (
        <Box
          key={index}
          display="grid"
          gap={1}
          sx={{ gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' }, mb: 2 }}
        >
          <Box>
            {index === 0 && (
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Start Withdrawal Year')}
              </Typography>
            )}
            <TextField
              fullWidth
              variant="standard"
              value={input.startWithdrawalYear || ''}
              disabled={true}
            />
          </Box>
          <Box>
            {index === 0 && (
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Withdraw Number of Years')}
              </Typography>
            )}
            <TextField
              fullWidth
              variant="standard"
              value={input.withdrawNumberOfYear || ''}
              disabled={true}
            />
          </Box>
          <Box>
            {index === 0 && (
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Max Amount Withdraw Yearly')}
              </Typography>
            )}
            <TextField
              fullWidth
              variant="standard"
              value={input.maxAmountWithdrawYearly ? formatNumber(input.maxAmountWithdrawYearly.toFixed(2)) : '0'}
              disabled={true}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
          </Box>
          <Box>
            {index === 0 && (
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Amount Withdraw Yearly')}
              </Typography>
            )}
            <TextField
              fullWidth
              variant="standard"
              value={formatNumber((notionalAmount * (rates[index] / 100)).toFixed(2))}
              disabled={true}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
          </Box>
          <Box>
            {index === 0 && (
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Annual Dividend Rate')}
              </Typography>
            )}
            <Select
              fullWidth
              variant="standard"
              value={rates[index]}
              onChange={(e) => handleRateChange(index, e.target.value)}
              disabled={disabled || availableRatesArray[index].length === 0}
            >
              {availableRatesArray[index].map((r) => (
                <MenuItem key={r} value={r}>
                  {r}%
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default InputWithRate;