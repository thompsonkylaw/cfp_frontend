import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ProposalInfo = ({ open, onClose, cashValueInfo, proposal }) => {
  const { t } = useTranslation();
  const currencyRate = proposal.target.currencyRate;
  const age = proposal.target.age;
  const numberOfPayments = proposal.target.numberOfYears;
  const annualPremiumClean = String(cashValueInfo.annual_premium).replace(/,/g, '');
  
  console.log("cashValueInfo.annual_premium===",cashValueInfo.annual_premium);
  console.log("firstTableData===",cashValueInfo.firstTable_data);
  console.log("proposal",proposal);

  const annualPremium = parseFloat(annualPremiumClean);
  const cashValueTable = cashValueInfo.cashValueTable;

  const inputs = proposal.inputs.map((item) => ({
    startWithdrawalYear: Number(item.startWithdrawalYear),
    withdrawNumberOfYear: Number(item.withdrawNumberOfYear),
    amountWithdrawYearly: Number(item.amountWithdrawYearly),
    annualDividendRate: Number(item.annualDividendRate),
    accountBalance: Number(item.accountBalance),
  }));

  const firstTableData = cashValueInfo.firstTable_data || [];
  const cashValueRows = cashValueTable ? cashValueTable.split('\n') : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        {/* Summary Table */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#956251' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>{t('common.age')}</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>{t('proposalInfo.numberOfPayments')}</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.annualPremium')} (USD)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.totalPremiumsPaidUpToYear')} (USD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#efeae9' }}>
                <TableCell sx={{ fontSize: '1.2rem' }}>{age}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{numberOfPayments}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }} align="right">{numberFormatter.format(annualPremium)}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }} align="right">{numberFormatter.format(annualPremium * numberOfPayments)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* First Table */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#ddd3d0' }}>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }}>{t('proposalInfo.age')}</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.cashValue')} (USD)</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.profitFactor')}</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.irr')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {firstTableData.map((row, index) => {
                const year = row[0];
                let adjustedYear;
                let displayAge;

                if (typeof year === 'string' && year.startsWith('@ANB')) {
                  const extractedNumber = parseInt(year.replace('@ANB', '').trim(), 10);
                  if (isNaN(extractedNumber)) {
                    console.error('Invalid number in @ANB format');
                    adjustedYear = NaN;
                    displayAge = 'Invalid';
                  } else {
                    adjustedYear = extractedNumber - age;
                    displayAge = `${adjustedYear} @ANB ${extractedNumber} ${t('outputForm3.ageLabel')}`;
                  }
                } else {
                  adjustedYear = parseInt(year, 10);
                  if (isNaN(adjustedYear)) {
                    console.error('Invalid year: not a number');
                    displayAge = 'Invalid';
                  } else {
                    displayAge = String(adjustedYear);
                  }
                }
                const cashValue = row[1];
                const cleanedValue = cashValue.replace(/,/g, '');
                const numberCashValue = parseFloat(cleanedValue);

                const totalPremiumsPaidUpToYear = annualPremium * Math.min(adjustedYear, numberOfPayments);
                const profitFactor = totalPremiumsPaidUpToYear > 0 ? numberCashValue / totalPremiumsPaidUpToYear : 0;

                let annualizedReturnPercent;
                if (adjustedYear > 0 && totalPremiumsPaidUpToYear > 0 && !isNaN(numberCashValue)) {
                  const ratio = numberCashValue / totalPremiumsPaidUpToYear;
                  if (ratio >= 0) {
                    const annualizedReturn = Math.pow(ratio, 1 / adjustedYear) - 1;
                    annualizedReturnPercent = (annualizedReturn * 100).toFixed(2) + '%';
                  } else {
                    annualizedReturnPercent = '-100.00%';
                  }
                } else {
                  annualizedReturnPercent = 'N/A';
                }

                return (
                  <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#efeae9' : '#ddd3d0' }}>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{displayAge}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{numberFormatter.format(numberCashValue)}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{profitFactor < 100 ? (profitFactor < 10 ? profitFactor.toFixed(2) : profitFactor.toFixed(1)) : profitFactor.toFixed(0)}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{annualizedReturnPercent}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Second Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#9b2d1f' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{t('Start Withdrawal Year')}</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{t('Withdraw Number of Years')}</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }} align="right">{t('Amount Withdraw Yearly')} (USD)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }} align="right">{t('Annual Dividend Rate')} (USD)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }} align="right">{t('Account Balance')} (USD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inputs.map((input, index) => {
                const startWithdrawalYear = input.startWithdrawalYear;
                const withdrawNumberOfYear = input.withdrawNumberOfYear;
                const amountWithdrawYearly = input.amountWithdrawYearly;
                const annualDividendRate = input.annualDividendRate;
                const accountBalance = input.accountBalance;

                console.log("startWithdrawalYear=",startWithdrawalYear);
                console.log("withdrawNumberOfYear=",withdrawNumberOfYear);
                console.log("amountWithdrawYearly=",amountWithdrawYearly);
                console.log("annualDividendRate=",annualDividendRate);
                console.log("accountBalance=",accountBalance);

                return (
                  <TableRow key={index} sx={{ backgroundColor: '#efeae9' }}>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{startWithdrawalYear}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{withdrawNumberOfYear}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{numberFormatter.format(amountWithdrawYearly)}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{`${(annualDividendRate)}%`}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{numberFormatter.format(accountBalance)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProposalInfo;