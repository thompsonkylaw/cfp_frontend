import React from 'react';
import { Box, Typography, Select, MenuItem, TextField, InputAdornment, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Input = ({ input, updateInput, disabled, isFirst, company }) => {
  const { t } = useTranslation();
  const startWithdrawalYearOptions = Array.from({ length: 25 }, (_, i) => i + 6); // [6, 7, ..., 30]
  const withdrawNumberOfYearOptions = [10, 20, 30, 40, 50];

  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const handleChange = (field) => (event) => {
    updateInput({ ...input, [field]: event.target.value });
  };

  const handlePdfDownload = (pdfBase64, filename) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = filename;
    link.click();
  };

  return (
    <Box
      display="grid"
      gap={1}
      sx={{ gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' }, mt: 2 }}
    >
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('Start Withdrawal Year')}
          </Typography>
        )}
        <Select
          fullWidth
          variant="standard"
          value={input.startWithdrawalYear || ''}
          onChange={handleChange('startWithdrawalYear')}
          error={!input.startWithdrawalYear}
          disabled={disabled}
        >
          <MenuItem value="">Select Start Year</MenuItem>
          {startWithdrawalYearOptions.map((year) => (
            <MenuItem key={year} value={String(year)}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('Withdraw Number of Years')}
          </Typography>
        )}
        <Select
          fullWidth
          variant="standard"
          value={input.withdrawNumberOfYear || ''}
          onChange={handleChange('withdrawNumberOfYear')}
          error={!input.withdrawNumberOfYear}
          disabled={disabled}
        >
          <MenuItem value="">Select Number of Years</MenuItem>
          {withdrawNumberOfYearOptions.map((years) => (
            <MenuItem key={years} value={String(years)}>
              {years}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('Amount Withdraw Yearly')}
          </Typography>
        )}
        <TextField
          fullWidth
          variant="standard"
          value={formatNumber(Number(input.amountWithdrawYearly || 0))}
          disabled={true}
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
        />
      </Box>
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('Annual Dividend Rate')}
          </Typography>
        )}
        <TextField
          fullWidth
          variant="standard"
          value={input.annualDividendRate ? `${input.annualDividendRate}%` : '0%'}
          disabled={true}
        />
      </Box>
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('Account Balance')}
          </Typography>
        )}
        <TextField
          fullWidth
          variant="standard"
          value={formatNumber(Number(input.accountBalance || 0))}
          disabled={true}
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
        />
      </Box>
      <Box>
        {isFirst && (
          <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
            {t('Download File')}
          </Typography>
        )}
        <Button
          variant="contained"
          disabled={!input.pdf_base64}
          onClick={() => handlePdfDownload(input.pdf_base64, input.filename)}
        >
          {t('Download')}
        </Button>
      </Box>
    </Box>
  );
};

export default Input;