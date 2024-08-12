document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const incomeForm = document.getElementById('income-form');
    const expensesContainer = document.getElementById('expenses-container');
    const balanceContainer = document.getElementById('balance-container');
  
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let income = JSON.parse(localStorage.getItem('income')) || [];
  
    const updateUI = () => {
      expensesContainer.innerHTML = '';
      const groupedExpenses = expenses.reduce((groups, expense) => {
        if (!groups[expense.category]) {
          groups[expense.category] = [];
        }
        groups[expense.category].push(expense);
        return groups;
      }, {});
  
      for (const [category, items] of Object.entries(groupedExpenses)) {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryCard.appendChild(categoryTitle);
  
        const expenseList = document.createElement('ul');
        items.forEach((expense, index) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${expense.name}: $${expense.amount} (${expense.period})`;
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Eliminar';
          deleteButton.onclick = () => {
            expenses.splice(expenses.indexOf(expense), 1);
            updateUI();
            saveToLocalStorage();
          };
          listItem.appendChild(deleteButton);
          expenseList.appendChild(listItem);
        });
  
        categoryCard.appendChild(expenseList);
        expensesContainer.appendChild(categoryCard);
      }
  
      // Calculate total expenses and income
      const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
      const totalIncome = income.reduce((total, inc) => total + inc.amount, 0);
      const balance = totalIncome - totalExpenses;
  
      balanceContainer.innerHTML = `
        <div class="balance">
          <h2>Saldo Disponible</h2>
          <h3>$${balance.toFixed(2)}</h3>
        </div>
      `;
    };
  
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('expense-name').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);
      const category = document.getElementById('expense-category').value;
      const period = document.getElementById('expense-period').value;
  
      if (isNaN(amount)) return;
  
      expenses.push({ name, amount, category, period });
      updateUI();
      saveToLocalStorage();
      expenseForm.reset();
    });
  
    incomeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('income-amount').value);
      const period = document.getElementById('income-period').value;
  
      if (isNaN(amount)) return;
  
      income.push({ amount, period });
      updateUI();
      saveToLocalStorage();
      incomeForm.reset();
    });
  
    // Save expenses and income to localStorage
    const saveToLocalStorage = () => {
      localStorage.setItem('expenses', JSON.stringify(expenses));
      localStorage.setItem('income', JSON.stringify(income));
    };
  
    // Load expenses and income from localStorage
    const loadFromLocalStorage = () => {
      expenses = JSON.parse(localStorage.getItem('expenses')) || [];
      income = JSON.parse(localStorage.getItem('income')) || [];
      updateUI();
    };
  
    loadFromLocalStorage();
});
