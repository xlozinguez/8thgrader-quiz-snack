import React from 'react';

function App() {
  return React.createElement('div', {
    style: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#2c3e50',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }
  }, [
    React.createElement('h1', { key: 'title' }, '8th Grade Quiz App'),
    React.createElement('p', { key: 'subtitle' }, 'Simple React Test'),
    React.createElement('p', { key: 'status' }, 'If you see this, React is working!')
  ]);
}

export default App;