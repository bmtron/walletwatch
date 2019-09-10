import React from 'react';

const BudgetContext = React.createContext({
    netIncome: 0,
    disposableIncome: 0,
    budgetItems: [],
    dailyItems: []
})

export default BudgetContext;