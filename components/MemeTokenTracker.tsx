import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Moon, Sun } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
`;

const Switch = styled.input.attrs({ type: 'checkbox' })`
  margin: 0 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: ${(props) => props.theme.cardBackground};
  color: ${(props) => props.theme.textColor};
`;

const CardTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: ${(props) =>
    props.variant === 'destructive' ? '#ff4d4f' : '#1890ff'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TokenModule = ({ date, onDelete, onUpdate, data }) => {
  const [checklist, setChecklist] = useState(
    data.checklist || {
      noMint: false,
      notFreezable: false,
      burn: false,
      oneSocial: false,
    }
  );
  const [tokenName, setTokenName] = useState(data.tokenName || '');
  const [investmentAmount, setInvestmentAmount] = useState(
    data.investmentAmount || ''
  );
  const [pnl, setPnl] = useState(data.pnl || '');

  const handleChecklistChange = (item) => {
    const newChecklist = { ...checklist, [item]: !checklist[item] };
    setChecklist(newChecklist);
    onUpdate({ checklist: newChecklist, tokenName, investmentAmount, pnl });
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    onUpdate({
      checklist,
      tokenName,
      investmentAmount,
      pnl,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <Card>
      <CardTitle>{formatDate(date)}</CardTitle>
      <div>
        {Object.entries(checklist).map(([key, value]) => (
          <ChecklistItem key={key}>
            <input
              type='checkbox'
              checked={value}
              onChange={() => handleChecklistChange(key)}
              id={key}
            />
            <label htmlFor={key}>{key}</label>
          </ChecklistItem>
        ))}
      </div>
      <Input
        name='tokenName'
        placeholder='Token Name'
        value={tokenName}
        onChange={handleInputChange(setTokenName)}
      />
      <Input
        name='investmentAmount'
        placeholder='Investment Amount'
        type='number'
        value={investmentAmount}
        onChange={handleInputChange(setInvestmentAmount)}
      />
      <Input
        name='pnl'
        placeholder='P&L'
        type='number'
        value={pnl}
        onChange={handleInputChange(setPnl)}
      />
      <Button variant='destructive' onClick={onDelete}>
        <Trash2 size={16} />
      </Button>
    </Card>
  );
};

const MemeTokenTracker = () => {
  const [modules, setModules] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedModules = localStorage.getItem('memeTokenModules');
    if (savedModules) {
      setModules(JSON.parse(savedModules));
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('memeTokenModules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.dataset.theme = theme;
  }, [theme]);

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      date: new Date().toISOString(),
      data: {},
    };
    setModules([...modules, newModule]);
  };

  const deleteModule = (id) => {
    setModules(modules.filter((module) => module.id !== id));
  };

  const updateModule = (id, newData) => {
    setModules(
      modules.map((module) =>
        module.id === id ? { ...module, data: newData } : module
      )
    );
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Container>
      <Header>
        <Title>Meme Token Investment Tracker</Title>
        <ThemeToggle>
          <Sun size={16} />
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
          <Moon size={16} />
        </ThemeToggle>
      </Header>
      <Grid>
        {modules.map((module) => (
          <TokenModule
            key={module.id}
            date={module.date}
            onDelete={() => deleteModule(module.id)}
            onUpdate={(newData) => updateModule(module.id, newData)}
            data={module.data}
          />
        ))}
      </Grid>
      <Button onClick={addModule}>
        <Plus size={16} /> Add New Token
      </Button>
    </Container>
  );
};

export default MemeTokenTracker;
