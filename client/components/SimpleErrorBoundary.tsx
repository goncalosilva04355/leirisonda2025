import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SimpleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // NÃO capturar erros - deixar a aplicação continuar normalmente
    console.warn("SimpleErrorBoundary: Ignorando erro:", error.message);
    return { hasError: false }; // Sempre retornar sem erro
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn("SimpleErrorBoundary: Erro ignorado:", error, errorInfo);
  }

  render() {
    // Sempre renderizar os children - nunca mostrar erro
    return this.props.children;
  }
}
