
'use client'
import { useUser } from "@clerk/nextjs"
import {Paper, Box,Container, TextField, Typography, Button, Grid, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material"
import { collection, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
// import { useState } from "react"

export default function Generate() {

    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {

        fetch('api/generate', {
            method: 'POST',
            body: text,
        }).then((res) => res.join()).then(data => setFlashcards(data))
    }

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
    const saveFlashcards= async()=>{
        if(!name){
            alert("please enter name")
            return
        } 
    const batch=writeBatch(db)
    const userDocRef=doc(collection(db,'users'),user.id)
    //userRedViaSpecificuser
    //str userid >> flashcards-{front:,back:}
    const docSnap=await getDoc(userDocRef)
    if(docSnap.exists()){
        const collections=docSnap.data().flashcards || []
        if(collections.find((f)=> f.name===name)){
            alert("flashcards with this name already exist")
            return
        }
        else{
            collections.push({name})
            batch.set(userDocRef,{flashcards:collections},{merge:true})
        }
    }
    else{
        batch.set(userDocRef,{flashcards:[{name}]})
    }

    const colRef=collection(userDocRef,name)
    flashcards.forEach((flashcard)=>{
        const cardDocRef=doc(colRef)
        batch.set(cardDocRef,flashcard)
    })
    await batch.commit()
    handleClose()
    router.push('/flashcard')
    }
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
                    {flashcards.map((flashcard,index)=>(
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea 
                                onClick={()=>{
                                    handleCardClick(index)
                                }}>
                                     
                  <CardContent
                    sx={{
                      perspective: "1000px",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s",
                      "&.flipped": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        transform: "rotateY(0deg)",
                        backfaceVisibility: "hidden",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {flashcard.front}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {flashcard.back}
                      </Typography>
                    </Box>
                  </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter name for your flashcard
            </DialogContentText>
          </DialogContent>
            
        </Dialog>
    </Container>
}