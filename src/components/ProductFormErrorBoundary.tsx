import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Alert, Button, Card } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ProductFormErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "ProductForm Error Boundary caught an error:",
      error,
      errorInfo,
    );
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card>
          <Alert
            message="Lỗi tải form"
            description={
              <div>
                <p>Đã xảy ra lỗi khi tải dữ liệu form. Vui lòng thử lại.</p>
                {this.state.error && (
                  <details style={{ marginTop: 8 }}>
                    <summary>Chi tiết lỗi</summary>
                    <pre style={{ fontSize: 12, color: "#666" }}>
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
              </div>
            }
            type="error"
            action={
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
              >
                Tải lại trang
              </Button>
            }
          />
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ProductFormErrorBoundary;
