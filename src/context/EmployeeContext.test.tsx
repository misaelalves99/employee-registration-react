// src/contexts/EmployeeContext.test.tsx

import { EmployeeContext } from './EmployeeContext';
import { render } from '@testing-library/react';

describe('EmployeeContext', () => {
  it('deve criar um contexto com o tipo correto', () => {
    expect(EmployeeContext).toBeDefined();
    const Provider = EmployeeContext.Provider;
    expect(Provider).toBeDefined();

    const TestComponent = () => {
      return <EmployeeContext.Provider value={undefined}><div>Test</div></EmployeeContext.Provider>;
    };

    render(<TestComponent />);
  });
});
