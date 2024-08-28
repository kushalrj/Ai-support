import { SignIn, SignUp } from "@clerk/nextjs";
import { Box,AppBar, Button, Container, Toolbar, Typography} from "@mui/material";
import Link from "next/link";



export default function  SignUpPage() {
    return <Container maxWidth="sm">
        <AppBar position="static" sx={{backgroundColor:"3f51b5"}}>
         
        <Toolbar>
            <Typography variant="h6" sx={{
                flexGrow:1,
            }}>
                Flashcard SaaS
            </Typography>
            <Button color="inherit">
            <Link href="/sign-in" passHref>
            Login
            </Link>
            </Button>
            <Button color="inherit">
            <Link href="/sign-up" passHref>
            SignUp
            </Link>
            </Button>
        </Toolbar>
        </AppBar>
        <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center" >
            <Typography variant="h4">Sign Up</Typography>
            <SignUp/>
        </Box>
          </Container>

}