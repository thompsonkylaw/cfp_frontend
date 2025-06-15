import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';

const InputWithRate = ({ proposal, notionalAmount, updateInput, disabled }) => {
  const { t } = useTranslation();
  const [rates, setRates] = useState(proposal.inputs.map((input) => input.annualDividendRate || 1));

  const maxRates = useMemo(
    () =>
      proposal.inputs.map((input) =>
        notionalAmount > 0 ? (input.maxAmountWithdrawYearly / notionalAmount) * 100 : 0
      ),
    [proposal.inputs, notionalAmount]
  );

  const availableRatesArray = useMemo(
    () =>
      maxRates.map((maxRate) =>
        maxRate >= 1 ? Array.from({ length: Math.floor(maxRate) }, (_, i) => i + 1) : []
      ),
    [maxRates]
  );

  useEffect(() => {
    const newRates = rates.map((rate, index) => {
      const availableRates = availableRatesArray[index];
      if (availableRates.length > 0) {
        if (!availableRates.includes(rate)) {
          return availableRates[availableRates.length - 1];
        }
        return rate;
      }
      return 0;
    });

    if (!newRates.every((rate, index) => rate === rates[index])) {
      setRates(newRates);
    }
  }, [availableRatesArray, rates]);

  useEffect(() => {
    proposal.inputs.forEach((input, index) => {
      const selectedRate = rates[index];
      const computedAmount = notionalAmount > 0 ? Math.round((selectedRate / 100) * notionalAmount * 100) / 100 : 0;
      if (
        computedAmount !== input.amountWithdrawYearly ||
        selectedRate !== input.annualDividendRate
      ) {
        updateInput(index, {
          ...input,
          amountWithdrawYearly: computedAmount,
          annualDividendRate: selectedRate,
        });
      }
    });
  }, [rates, notionalAmount, updateInput, proposal.inputs]);

  const handleRateChange = (index, value) => {
    setRates((prevRates) => {
      const newRates = [...prevRates];
      newRates[index] = value;
      return newRates;
    });
  };

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
            <TextField fullWidth variant="standard" value={input.startWithdrawalYear || ''} disabled={true} />
          </Box>
          <Box>
            {index === 0 && (
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                {t('Withdraw Number of Years')}
              </Typography>
            )}
            <TextField fullWidth variant="standard" value={input.withdrawNumberOfYear || ''} disabled={true} />
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
              value={input.maxAmountWithdrawYearly ? formatNumber(input.maxAmountWithdrawYearly.toFixed(0)) : '0'}
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
              value={formatNumber((notionalAmount * (rates[index] / 100)).toFixed(0))}
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