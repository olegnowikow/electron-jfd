import { Button, Container, CssBaseline, Grid, Snackbar, ThemeProvider } from "@mui/material";
import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { ipcRenderer } from 'electron';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey['100'],
  minHeight: '100vh'
}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const send = () => {
  ipcRenderer.send("html");
}

interface Message {
  open: boolean;
  message: string;
}

export default function App(): JSX.Element {

  const theme = useTheme();

  ipcRenderer.on("reply", (event: any, data: string) => {
    console.log("reply:", event, data);
    setMessage({ open: true, message: data });
  });


  const [message, setMessage] = React.useState({ open: false, message: "File created!" } as Message);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessage({ open: false, message: message.message });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Wrapper>
        <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
              <Container maxWidth="md">
                <Grid container justifyContent="center">
                  <Button onClick={send} variant="outlined">Создать файл</Button>
                  <Snackbar
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={message.open}
                    autoHideDuration={3000}
                    message={message.message}
                    onClose={handleClose}
                  >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                      {message.message}
                    </Alert>
                  </Snackbar>
                </Grid>
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Wrapper>
    </ThemeProvider>
  );
}
