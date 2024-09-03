
'use client'
import { useUser } from "@clerk/nextjs"
import {Paper, Box,Container, TextField, Typography, Button, Grid, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions ,Card} from "@mui/material"
import { collection, writeBatch, doc, getDoc } from "firebase/firestore";

import { useRouter } from "next/navigation"
import { useState } from "react"
import {db} from '@/firebase'
// import { useState } from "react"

export default function Generate() {

    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(true)
    const router = useRouter()

    const handleSubmit = async () => {
      
      try {
        const response = await fetch("api/generate", {
          method: "POST",
          body: text,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't got JSON!");
        }
  
        const data = await response.json();
        setFlashcards(data);
        // setActiveStep(1);
      } catch (error) {
        console.error("Error in handleSubmit:", error);
       
      } 
    };
    
    const handleCardClick=(id)=>{
        setFlipped((prev)=>({
            ...prev,
            [id]:!prev[id],
        }))
    }

    const handleOpen=()=>{
        setOpen(true)
    }
    const handleClose=()=>{
        setOpen(false)
    }
    const saveFlashcards = async () => {
      if (!name) {
        alert("Please enter a name for the flashcards");
        return;
      }
    
      try {
        console.log("Starting saveFlashcards...");
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id); // Make sure the user is correctly logged in and user.id is available
        console.log("User document reference:", userDocRef);
    
        // Fetch the current document
        const docSnap = await getDoc(userDocRef);
        console.log("Document snapshot:", docSnap.exists() ? docSnap.data() : "Document does not exist");
    
        // Initialize the flashcards array
        let collections = [];
    
        if (docSnap.exists()) {
          collections = docSnap.data().flashcards || [];
          if (collections.some((f) => f.name === name)) {
            alert("Flashcards with this name already exist");
            return;
          }
        }
    
        // Add the new flashcard collection name
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
    
        // Create a sub-collection for the flashcards
        const colRef = collection(userDocRef, name);
        console.log("Sub-collection reference:", colRef);
    
        flashcards.forEach((flashcard) => {
          const cardDocRef = doc(colRef);
          console.log("Setting flashcard:", flashcard);
          batch.set(cardDocRef, flashcard);
        });
    
        // Commit the batch operation
        await batch.commit();
        console.log("Batch committed successfully");
        handleClose();
        router.push('/flashcard');
      } catch (error) {
        console.error("Error saving flashcards:", error);
        alert("Failed to save flashcards. Please try again.");
      }
    };
    
    return <Container maxWidth="md">
     <Box sx={{
        mt:4,mb:6,display:'flex',flexDirection:'column',alignItems:'center'
     }}>
        <Typography variant="h4">Generate flashcard</Typography>
        <Paper sx={{p:4,width:'100%'}}>
            <TextField value={text}
            onChange={(e)=>{setText(e.target.value)}}
            label="Enter Text" fullWidth multiline rows={4} variant="outlined" sx={{mb:2,}}>
            
            </TextField>
            <Button
            variant="contained" color="primary" onClick={handleSubmit} fullWidth>Submit</Button>
        </Paper>
        </Box> 
        {flashcards.length>0 && (
            <Box sx={{mt:4}}>
                <Typography variant="h5">Flashcards Preview</Typography>
                <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",

                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box
                        sx={{
                          perspective: "1000px",
                          "& > div": {
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "250px",
                            backgroundColor: " #f6fcff",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            transform: flipped[index]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
                          },
                          "& > div > div": {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            boxSizing: "border-box",
                          },
                          "& > div > div:nth-of-type(2)": {
                            transform: "rotateY(180deg)",
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{mt:4, display:'flex', justifyContent:'center'}}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
            </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter name for your flashcard
            </DialogContentText>
            <TextField
            autoFocus
            margin="dense"
            label="Collection Name" type="text" fullWidth value={name} onChange={(e)=>setName(e.target.value)} variant="outlined">

            </TextField>
          </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={saveFlashcards}>Save Flashcards</Button>
            </DialogActions>
        </Dialog>
    </Container>
}