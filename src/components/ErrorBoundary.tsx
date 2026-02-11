import { Component, ReactNode } from "react";
import { Alert, Code, Container, Stack } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Container size="xl" mt="sm" mb="lg">
          <Alert
            variant="filled"
            color="red"
            title="Something went wrong"
            icon={<IconExclamationCircle />}
            m="md"
          >
            <Stack gap="xs">
              <span>{this.state.error.message}</span>
              {this.state.error.stack && (
                <Code block>{this.state.error.stack}</Code>
              )}
            </Stack>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
