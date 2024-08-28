// import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid, Card, CardContent } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text " />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>Flashcard Saas</Typography>
           <SignedOut>
            <Button color="inherit" href="sign-in">Login</Button>
            <Button color="inherit" href="sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
         
        </Toolbar>
      </AppBar>

      <Box sx={{
        textAlign:'center',
        my:4,
      }}>
        <Typography variant="h2">Welcome to flashcard Saas</Typography>
        <Typography>{' '} The easiest way to make flashcards from text</Typography>
        <Button variant="contained" color="primary" sx={{mt:2}}>Get Started</Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Feature 1</Typography>
                <Typography>Details about feature 1.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Feature 2</Typography>
                <Typography>Details about feature 2.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Feature 3</Typography>
                <Typography>Details about feature 3.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Basic Plan</Typography>
                <Typography>Free</Typography>
                <Typography>Basic features included.</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} >Choose Basic</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Pro Plan</Typography>
                <Typography>$10/month</Typography>
                <Typography>Advanced features and more.</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} >Choose Pro</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Enterprise Plan</Typography>
                <Typography>$50/month</Typography>
                <Typography>All features and premium support.</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} >Choose Enterprise</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}