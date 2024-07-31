'use client'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { collection, query, setDoc, getDoc, getDocs, doc, deleteDoc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  // an async function that updates the inventory from the firestore database
  async function updateInventory() {
    // creates a query object for the 'inventory' collection; doesn't actually execute the query, just sets it up
    // creates a reference to the 'inventory' collection in the firestore database
    // a snapshot is a representation of teh data at a specific point in time
    const snapshot = query(collection(firestore, 'inventory'))

    // executes the query and gets the documents from the collection
    // the await keyword is used to wait for the query to finish executing before moving on to the next line
    const docs = await getDocs(snapshot)

    // creates an empty array to store the inventory items
    const inventoryList = []

    // loops through each document in the collection and adds it to the inventoryList array
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id, // the document ID is the name of the item
        ...doc.data() // spreads the document's data into the new object, adding all fields from the document
      })
    })

    // sets the inventory state to the new inventoryList array
    setInventory(inventoryList)
  }

  // an async function that decreases the count of an item in the inventory
  async function removeItem(item) {
    // collection() gets a reference to the 'inventory' collection in the firestore database
    // creates a reference to a specific document in the collection using the item name
    const docRef = doc(collection(firestore, 'inventory'), item)

    // gets the document snapshot for the document reference
    const docSnap = await getDoc(docRef)

    // checks if the document exists
    if (docSnap.exists()) {
      // gets the current count value from the document data
      const { count } = docSnap.data()

      // if the count is 1, it means this is the last item, so delete the document
      if (count === 1) {
        // deletes the document from the collection
        await deleteDoc(docRef)
      } else {
        // if the count is greater than 1, decrease the count by 1
        await setDoc(docRef, { count: count - 1 })
      }
    }

    // updates the inventory to reflect the changes
    await updateInventory()  
  }

  // an async function that adds an item to the inventory
  async function addItem(item) {
    const docRef = doc(collection(firestore, 'inventory'), item)

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { count } = docSnap.data()
      await setDoc(docRef, { count: count + 1 })
    } else {
      await setDoc(docRef, { count: 1})
    }

    await updateInventory()
  }

  // an async function that removes an entire item from the inventory
  async function removeEntireItem(item) {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  useEffect(() => {
    // calls the updateInventory function when the component mounts (i.e. when the page loads)
    updateInventory()
  }, [])

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position='absolute'
          top='50%'
          left='50%'
          width={400}
          bgcolor='white'
          border='2px solid black'
          boxShadow={24}
          p={4}
          display='flex'
          flexDirection='column'
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: 3,
          }}
        >
          <Typography variant='h2'>Add Item</Typography>
          <Stack width='100%' direction='row' spacing={2}>
            <TextField
              variant='outlined'
              fullWidth 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button variant='outlined' onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose() 
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant='contained' onClick={handleOpen}>Add Item</Button>
      <Box border='1px solid #333'>
        <Box width='800px' height='100px' bgcolor='#ADD8E6' display='flex' justifyContent='center' alignItems='center'>
          <Typography variant='h2' color='#333'>Pantry Items</Typography>
        </Box>
        <Stack width='800px' height='300px' spacing={2} overflow='auto'>
          {inventory.map(({name, count}) => {
            return (
              <Box
                key={name}
                width='100%'
                minHeight='150px'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                bgcolor='#f0f0f0'
                padding={5}
              >
                <Typography variant='h5' color='#333' textAlign='center' textTransform='capitalize'>
                  {name}
                </Typography>
                <Typography variant='h5' color='#333' textAlign='center'>
                  {count}
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Button variant='contained' onClick={() => addItem(name)}>Increment</Button>
                  <Button variant='contained' onClick={() => removeItem(name)}>Decrement</Button>
                  <Button variant='contained' onClick={() => removeEntireItem(name)}>Remove Item</Button>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </Box>
  )
}