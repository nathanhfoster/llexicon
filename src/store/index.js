const storeFactory = () => ({
    isReady: false,
    state: null,
    dispatch: () => {
      console.error('Store is NOT ready!')
    },
  })
  
  export default storeFactory