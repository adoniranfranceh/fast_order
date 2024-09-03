// theme.js
const theme = {
  colors: {
    white: '#FFFFFF',
    primary: '#7052F2',
    primaryHover: '#5633b4',
    secondary: '#00A166',
    secondaryHover: '#00754b',
    danger: '#D32F2F',
    background: '#F5F5FA',
    text: '#333333',
    mutedText: '#666666',

    doing: {
      background: '#E6E2F0',
      border: '#7B1FA2',
      text: '#4A0072',
    },
    delivered: {
      background: '#D0EBFF',
      border: '#1E88E5',
      text: '#0D47A1',
    },
    paid: {
      background: '#E9F7EF',
      border: '#66BB6A',
      text: '#388E3C',
    },
    canceled: {
      background: '#FDE9F2',
      border: '#F06292',
      text: '#C2185B',
    },
  },

  fonts: {
    primary: 'Inter, sans-serif',
  },

  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',

  spacing: {
    small: '10px',
    medium: '20px',
    large: '40px',
  },
  
  fontSizes: {
    small: '1rem',
    medium: '1.5rem',
    large: '2.5rem',
  },
};

export default theme;
