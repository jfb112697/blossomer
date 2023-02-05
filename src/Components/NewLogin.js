import React from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Paper,
} from "@mui/material";

export default function SignInSide() {
  return (
    <div className="bg-gray-100 h-screen relative">
      <div
        className="bg-center bg-cover h-screen"
        style={{ backgroundImage: `url(https://source.unsplash.com/random)` }}
      >
        <div className="absolute inset-0 w-full h-full bg-dark-600 bg-opacity-50">
          <Container component="main" maxWidth="xs">
            <div className="p-8 flex flex-col items-center">
              <Paper className="w-full max-w-md rounded-md shadow-md p-8">
                <form noValidate>
                  <Typography
                    component="h1"
                    variant="h4"
                    className="text-gray-800 font-bold mb-6"
                  >
                    Sign in
                  </Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    className="py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-gray-900"
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    className="py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-gray-900"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="mt-6 rounded-md shadow-sm"
                  >
                    Sign in
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2" className="text-gray-600">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2" className="text-gray-600">
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </div>
            <Box mt={8}>
              <Typography variant="body2" color="textSecondary" align="center">
                {"Copyright © "}
                <Link color="inherit" href="#">
                  Your Website
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
              </Typography>
            </Box>
          </Container>
        </div>
      </div>
    </div>
  );
}
