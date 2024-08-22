import { createContext, useContext, ReactNode } from 'react';

type LayoutContextType = {
  layout: 'default' | 'popup';
  setLayout: (layout: 'default' | 'popup') => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode; layout: 'default' | 'popup' }> = ({ children, layout }) => {
  const setLayout = (newLayout: 'default' | 'popup') => {
    // Logic to update layout, potentially storing in state or another context
  };

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
